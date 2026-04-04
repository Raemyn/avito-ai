import { Flex, Title } from '@mantine/core';

type Props = {
    count: number;
};

const getDeclension = (count: number) => {
    if (count % 10 === 1 && count % 100 !== 11) return "объявление";
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100))
        return "объявления";
    return "объявлений";
};

const AdsHeader = ({ count }: Props) => {
    return (
        <header>
            <Flex direction="column" py={12} pl={8} h={74}>
                <Title order={2} fw={500} fz={22} lh="127%" c="rgba(0, 0, 0, 0.85)">
                    Мои объявления
                </Title>

                <Title order={3} fw={400} fz={18} c="#848388">
                    {count} {getDeclension(count)}
                </Title>
            </Flex>
        </header>
    );
};

export default AdsHeader;