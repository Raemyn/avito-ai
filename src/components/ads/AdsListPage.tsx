import { ActionIcon, Box, Button, Divider, Flex, Menu, noop, Paper, Text, TextInput } from "@mantine/core"
import AdsHeader from "./AdsHeader"
import { IconChevronDown, IconLayoutGrid, IconList, IconSearch } from "@tabler/icons-react"
import { useState } from "react";

const AdsListPage = () => {
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [sort, setSort] = useState('По новизне (сначала новые)');
    return (

        <Box pt={10} pl={32} pr={32} bg="#f7f5f8" >
            <AdsHeader />
            <main>
                <Paper mt={16} radius={8} p={12} bg="#fff" h={56}>
                    <Flex align="center" >
                        <TextInput
                            mr={24}
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
                                    paddingBottom: '6px',
                                    lineHeight: '157%',
                                    color: '#707176',
                                },
                            }}
                        />
                        <Paper bg="#f7f5f8" radius={8} mr={16}>
                            <Flex gap={8} h={32} align="center" justify="center" >
                                <ActionIcon pl={4} bg="#f7f5f8"
                                    variant={view === 'grid' ? 'filled' : 'subtle'}
                                    onClick={() => setView('grid')}
                                >
                                    <IconLayoutGrid size={22} color="#1890ff" />
                                </ActionIcon>
                                <Divider color="#fff" h={28} orientation="vertical" />
                                <ActionIcon pr={4} bg="#f7f5f8"
                                    variant={view === 'list' ? 'filled' : 'subtle'}
                                    onClick={() => setView('list')}
                                >
                                    <IconList size={22} color="#000000" />
                                </ActionIcon>
                            </Flex>
                        </Paper>

                        <Menu>
                            <Menu.Target >
                                <Button
                                    color="#000"
                                    bg="#f7f5f8"
                                    w={240}
                                    h={32}
                                    radius={8}
                                    variant="outline"
                                    
                                    styles={{
                                        root: {
                                        
                                            fontSize: '14px',
                                            border: "none",
                                            borderRadius:'8px',
                                            alignSelf: 'center',
                                            textAlign:'center',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '0 4px', // подгоняем внутренние отступы
                                            height: 22,         // фиксируем высоту кнопки
                                        },
                                    }}
                                >
                                    <Text  pl={12} lts={0.2}  bg='#fff' h={22} fw={400}   fz={14}  color="#000">{sort}</Text>
                                    <Flex bg="#fff" pl={6}  w={24}  h={22} align="center"  >
                                        <IconChevronDown size={16}   color="#000" />
                                    </Flex>
                                </Button>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Item  onClick={() => setSort('По новизне (сначала новые)')}>
                                    По новизне (сначала новые)
                                </Menu.Item>
                                <Menu.Item onClick={() => setSort('По цене (сначала дорогие)')}>
                                    По цене (сначала дорогие)
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>

                    </Flex>
                </Paper>
            </main>
        </Box>
    )
}
export default AdsListPage