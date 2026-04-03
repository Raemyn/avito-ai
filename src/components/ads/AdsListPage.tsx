import { useState } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Collapse,
  Divider,
  Flex,
  Menu,
  Paper,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconChevronDown, IconLayoutGrid, IconList, IconSearch } from "@tabler/icons-react";
import AdsHeader from "./AdsHeader";

const AdsListPage = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("По новизне (сначала новые)");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = ["Авто", "Электроника", "Недвижимость"];

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <Box pt={10} pl={32} pr={32} bg="#f7f5f8">
      <AdsHeader />

      <main>
        <Paper mt={16} radius={8} p={12} bg="#fff" h={56}>
          <Flex align="center">
            <TextInput
              mr={24}
              placeholder="Найти объявление..."
              radius={8}
              w={958}
              rightSection={<IconSearch size={14} height={31} />}
              styles={{
                input: {
                  border: "none",
                  outline: "none",
                  backgroundColor: "#f7f5f8",
                  fontWeight: 400,
                  fontSize: "14px",
                  paddingBottom: "6px",
                  lineHeight: "157%",
                  color: "#707176",
                },
              }}
            />

            <Paper bg="#f7f5f8" radius={8} mr={16}>
              <Flex gap={8} h={32} align="center" justify="center">
                <ActionIcon
                  pl={4}
                  bg="#f7f5f8"
                  variant={view === "grid" ? "filled" : "subtle"}
                  onClick={() => setView("grid")}
                >
                  <IconLayoutGrid size={22} color="#1890ff" />
                </ActionIcon>

                <Divider color="#fff" h={28} orientation="vertical" />

                <ActionIcon
                  pr={4}
                  bg="#f7f5f8"
                  variant={view === "list" ? "filled" : "subtle"}
                  onClick={() => setView("list")}
                >
                  <IconList size={22} color="#000000" />
                </ActionIcon>
              </Flex>
            </Paper>

            <Menu>
              <Menu.Target>
                <Button
                  color="#000"
                  bg="#f7f5f8"
                  w={240}
                  h={32}
                  radius={8}
                  variant="outline"
                  styles={{
                    root: {
                      fontSize: "14px",
                      border: "none",
                      borderRadius: "8px",
                      alignSelf: "center",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0 4px",
                      height: 22,
                    },
                  }}
                  rightSection={<IconChevronDown size={16} color="#000" />}
                >
                  <Text pl={12} lts={0.2} bg="#fff" h={22} fw={400} fz={14} c="#000">
                    {sort}
                  </Text>
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item onClick={() => setSort("По новизне (сначала новые)")}>
                  По новизне (сначала новые)
                </Menu.Item>
                <Menu.Item onClick={() => setSort("По цене (сначала дорогие)")}>
                  По цене (сначала дорогие)
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Flex>
        </Paper>

        <Flex mt={16} gap={16}>
          <Flex p={16} bg="#fff" direction="column">
            <Title fw={500} fz={16}>
              Фильтры
            </Title>

            <Box w={240} mt={12}>
              <Button
                fullWidth
                variant="outline"
                radius={8}
                h={32}
                fz={14}
                fw={400}
                p={0}
                c="#000"
                justify="space-between"
                onClick={() => setCategoriesOpen((o) => !o)}
                rightSection={
                  <IconChevronDown
                    size={16}
                    style={{
                      transform: categoriesOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "0.2s",
                    }}
                  />
                }
                styles={{
                  root: {
                    border: "none",
                    justifyContent: "space-between",
                    paddingLeft: 12,
                    paddingRight: 12,

                  },
                }}
              >
                Категории
              </Button>

              <Collapse expanded={categoriesOpen}>
                <Paper mt={8} p={0} radius={8} >
                  {categories.map((cat) => (
                    <Flex key={cat} align="center" mb={8}>
                      <Checkbox
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        mr={8}
                      />
                      <Text fz={14}>{cat}</Text>
                    </Flex>
                  ))}
                </Paper>
              </Collapse>
            </Box>
          </Flex>

          <Flex flex={1}></Flex>
        </Flex>
      </main>
    </Box>
  );
};

export default AdsListPage;