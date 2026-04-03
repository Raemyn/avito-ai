import { Box, Flex, Title } from '@mantine/core';

const AdsHeader = () => {
    return (
        <header>
            <Flex direction="column" py={12} pl={8}>
                <Title
                    order={2}
                    fw={500}
                    fz={22}
                    lh="127%"
                    c="rgba(0, 0, 0, 0.85)"
                >
                    Мои объявления
                </Title>
                <Title order={3} fz={18}>
                    42 объявления
                </Title>
            </Flex>
        </header>
    );
};

export default AdsHeader;
