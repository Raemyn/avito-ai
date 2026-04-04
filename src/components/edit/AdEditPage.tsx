import { useParams } from "react-router-dom";
import { Box, Title } from "@mantine/core";

const AdEditPage = () => {
    const { id } = useParams();

    return (
        <Box p={40}>
            <Title>Редактирование #{id}</Title>
        </Box>
    );
};

export default AdEditPage;