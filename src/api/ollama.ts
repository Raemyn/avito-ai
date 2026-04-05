const OLLAMA_BASE_URL =
    import.meta.env.VITE_OLLAMA_BASE_URL ?? "http://localhost:11434/api";

const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL ?? "llama3";

type OllamaGenerateResponse = {
    response?: string;
    error?: string;
};

type AdContext = {
    category: "auto" | "real_estate" | "electronics";
    title: string;
    description?: string;
    price: number;
    params?: Record<string, unknown>;
};

function safeParseJson<T>(text: string): T {
    try {
        return JSON.parse(text) as T;
    } catch {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
            return JSON.parse(match[0]) as T;
        }

        throw new Error("LLM вернул невалидный JSON");
    }
}

async function ollamaGenerate<T>(system: string, prompt: string): Promise<T> {
    const res = await fetch(`${OLLAMA_BASE_URL}/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: OLLAMA_MODEL,
            system,
            prompt,
            format: "json",
            stream: false,
        }),
    });

    if (!res.ok) {
        throw new Error(`Ollama error: ${res.status}`);
    }

    const data = (await res.json()) as OllamaGenerateResponse;

    if (data.error) {
        throw new Error(data.error);
    }

    if (!data.response) {
        throw new Error("Пустой ответ от Ollama");
    }

    return safeParseJson<T>(data.response);
}

export async function suggestDescription(ad: AdContext) {
    return ollamaGenerate<{ description: string }>(
        "Ты помощник по улучшению объявлений. Возвращай только JSON без markdown и лишнего текста и описание должно быть направленна на русских.",
        `Сгенерируй или улучши описание для объявления.

Правила:
- Если description пустой, придумай новое описание.
- Если description уже есть, улучши его, сохранив факты и смысл.
- Не используй markdown, списки, заголовки и лишние пояснения.
- Верни только JSON.

Данные объявления:
${JSON.stringify(ad, null, 2)}

Верни строго JSON вида:
{"description":"..."}`
    );
}

export async function suggestMarketPrice(ad: AdContext) {
    const result = await ollamaGenerate<{
        price: number | string;
        reasons?: string[];
    }>(
        "Ты помощник по оценке объявлений. Не пиши markdown. Возвращай только JSON.",
        `Оцени рыночную цену объявления в рублях по данным ниже.
Это локальная оценка на основе контекста, без доступа к интернету.

Правила:
- Используй title, description и params.
- Учитывай состояние, комплектацию, год, пробег, площадь и другие признаки.
- Верни только JSON.
- price должен быть числом в рублях.
- reasons — массив из 1-4 коротких причин, почему цена такая.

Данные объявления:
${JSON.stringify(ad, null, 2)}

Верни строго JSON вида:
{"price":123456,"reasons":["краткая причина 1","краткая причина 2"]}`
    );

    const parsedPrice =
        typeof result.price === "string"
            ? Number(result.price.replace(/[^\d.-]/g, ""))
            : result.price;

    return {
        price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
        reasons: Array.isArray(result.reasons)
            ? result.reasons.map((item) => String(item)).filter(Boolean).slice(0, 4)
            : [],
    };
}