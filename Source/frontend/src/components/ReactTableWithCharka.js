import React, { useState } from "react";
import { useTable } from "react-table";
import {
  Table,
  Tbody,
  Tr,
  Th,
  Td,
  Thead,
  TableContainer,
  Box,
  Icon,
  Button,
  Text,
  HStack,
  IconButton,
  Checkbox,
  Avatar,
  Badge,
  MenuButton,
  MenuList,
  MenuItem,
  Menu,
  Stack,
} from "@chakra-ui/react";
import { FiMoreVertical } from "react-icons/fi";
import { GrPrevious, GrNext } from "react-icons/gr";
import avt_test from "../assets/ta.jpeg";
import {
  dumbTableData,
  roleCodeColor,
  tableRowAction,
} from "../pages/test/dumbTableData";

function ReactTableWithCharka() {
  const data = React.useMemo(() => dumbTableData);
  const columns = React.useMemo(
    () => [
      {
        Header: "Select",
        accessor: "action", // accessor is the "key" in the data
      },
      {
        Header: "Picture",
        accessor: "picture",
        isPicture: true,
      },
      {
        Header: "Full Name",
        accessor: "fullName",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Role",
        accessor: "role",
        isBadge: true,
      },
      {
        Header: "Phone Number",
        accessor: "phoneNumber",
      },
      {
        Header: "Address",
        accessor: "address",
      },
    ],
    []
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [isCurrentPage, setIsCurrentPage] = useState(null);

  const handleSelectAll = () => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(data.map((_, index) => index.toString()));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };
  const handleClick = (id, checked) => {
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };
  const handleClickPaging = (id, isActive) => {
    if (isActive == "false") {
      console.log("page ", id + 1);
      setIsCurrentPage(id);
    }
    return;
  };
  return (
    <Stack>
      <Box className="tool-bar"></Box>
      <TableContainer border="1px solid gray" rounded="lg">
        <Table variant="simple" {...getTableProps()}>
          <Thead bgColor="#9cb8ca">
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index) => {
                  if (index == "0") {
                    return (
                      <Th paddingRight={0} {...column.getHeaderProps()}>
                        <Checkbox
                          isChecked={isCheckAll}
                          onChange={handleSelectAll}
                          colorScheme="green"
                          size="lg"
                        >
                          <Text
                            textTransform="capitalize"
                            fontWeight="semibold"
                            fontSize="1rem"
                          ></Text>
                        </Checkbox>
                      </Th>
                    );
                  }
                  return (
                    <Th
                      textTransform="capitalize"
                      fontSize="lg"
                      {...column.getHeaderProps()}
                    >
                      {column.render("Header")}
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody bgColor="white" {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()}>
                  {row.cells.map((cell, index, id) => {
                    if (index == "0") {
                      return (
                        <Td
                          paddingRight={0}
                          width="50px"
                          {...cell.getCellProps()}
                        >
                          <HStack>
                            <Checkbox
                              key={id}
                              id={id}
                              isChecked={isCheck.includes(id[0].row.id)}
                              onChange={(e) => {
                                console.log(e);
                                handleClick(id[0].row.id, e.target.checked);
                              }}
                              colorScheme="green"
                              size="lg"
                            ></Checkbox>
                            <Menu>
                              <MenuButton>
                                {" "}
                                <IconButton
                                  colorScheme="blue"
                                  variant="outline"
                                  icon={<FiMoreVertical />}
                                />
                              </MenuButton>
                              <MenuList>
                                {tableRowAction.map((item) => {
                                  return (
                                    <MenuItem
                                      key={item.label}
                                      onClick={() =>
                                        item.func(cell.row.values, item.label)
                                      }
                                    >
                                      {item.label}
                                    </MenuItem>
                                  );
                                })}
                              </MenuList>
                            </Menu>
                          </HStack>
                        </Td>
                      );
                    } else {
                      if (cell.column.isPicture) {
                        return (
                          <Td>
                            <Avatar src={cell.value} />
                          </Td>
                        );
                      } else if (cell.column.isBadge) {
                        return (
                          <Td>
                            {roleCodeColor.map((item) => {
                              if (
                                Object.keys(item)[0].toLowerCase() ===
                                cell.value.toLowerCase()
                              ) {
                                return (
                                  <Badge
                                    colorScheme={Object.values(item)[0]}
                                    fontSize="lg"
                                  >
                                    {cell.render("Cell")}
                                  </Badge>
                                );
                              }
                            })}
                          </Td>
                        );
                      }
                      return (
                        <Td {...cell.getCellProps()}>
                          <Text
                            maxWidth={
                              cell.column.mWidth ? cell.column.mWidth : "200px"
                            }
                            textOverflow="ellipsis"
                            overflow="hidden"
                          >
                            {cell.render("Cell")}
                          </Text>
                        </Td>
                      );
                    }
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="flex-end" className="paging">
        <HStack>
          <Button isDisabled={isCurrentPage == 0}>
            <Icon boxSize="15px" as={GrPrevious} />
          </Button>
          {Array.from({ length: 5 }).map((_, index) => {
            return (
              <Button
                onClick={(e) => {
                  handleClickPaging(index, e.target.dataset.isactive);
                }}
                data-isActive={isCurrentPage == index}
                isActive={!(isCurrentPage == index)}
                bgColor="#99b0be"
                color="white"
              >
                {index + 1}
              </Button>
            );
          })}
          <Button isDisabled={isCurrentPage == 4}>
            <Icon boxSize="15px" as={GrNext} />
          </Button>
        </HStack>
      </Box>
    </Stack>
  );
}

export default ReactTableWithCharka;
