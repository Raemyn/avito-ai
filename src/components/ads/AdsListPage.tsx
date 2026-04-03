import { Box, Flex, Paper, TextInput } from "@mantine/core"
import AdsHeader from "./AdsHeader"
import { IconSearch } from "@tabler/icons-react"

const AdsListPage = () => {
    return (

        <Box pt={12} pl={32} pr={32} bg="#f7f5f8" >
            <AdsHeader />
            <main>
                <Paper mt={16} radius={8} p={12} bg="#fff" h={56}>
                    <Flex  >
                        <TextInput
                            placeholder="Найти объявление..."
                            radius={8}
                            w={958}
                            
                            rightSection={<IconSearch size={14} height={31} />}
                            styles={{
                                input: {
                                    
                                    border: 'none',
                                    outline: 'none',
                                    backgroundColor: "#f7f5f8",
                                    fontWeight: 400,
                                    fontSize: '14px',
                                    paddingBottom:'6px',
                                    lineHeight: '157%',
                                    color: '#707176',
                                },
                            }}
                        />
                    </Flex>
                </Paper>
            </main>
        </Box>
    )
}
export default AdsListPage