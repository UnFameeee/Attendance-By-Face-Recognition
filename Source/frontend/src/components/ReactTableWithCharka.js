import React, { useState } from "react";
import { usePagination, useRowSelect, useTable } from "react-table";
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
  Flex,
  Input,
  Select,
} from "@chakra-ui/react";
import { FiMoreVertical } from "react-icons/fi";
import { GrPrevious, GrNext } from "react-icons/gr";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import avt_test from "../assets/ta.jpeg";
import { dumbTableData, roleCodeColor } from "../pages/test/dumbTableData";
import debounce from "lodash/debounce";
function ReactTableWithCharka(props) {
  const { data, columns, handleDeleteRange, tableRowAction } = props;
  const debouncedGotoPage = debounce((value) => {
    const pageNumber = value ? Number(value) - 1 : 0;
    gotoPage(pageNumber);
  }, 500);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    page,
    prepareRow,
    selectedFlatRows,
    nextPage,
    previousPage,
    gotoPage,
    canNextPage,
    canPreviousPage,
    pageCount,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 1, pageSize: 10 },
    },
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "action",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <Flex gap="5px">
              <input type="checkbox" {...getToggleAllRowsSelectedProps()} />
              <Text>Action</Text>
            </Flex>
          ),
          Cell: ({ row }) => (
            <HStack>
              <input type="checkbox" {...row.getToggleRowSelectedProps()} />
              <Menu>
                <MenuButton colorScheme="blue" variant="outline" as={Button}>
                  <Icon as={FiMoreVertical} />
                </MenuButton>
                <MenuList>
                  {tableRowAction.map((item) => {
                    return (
                      <MenuItem
                        key={item.actionName}
                        onClick={() => item.func(row.values, item.actionName)}
                      >
                        {item.actionName}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Menu>
            </HStack>
          ),
        },
        ...columns,
      ]);
    },
    usePagination,
    useRowSelect
  );
  return (
    <Stack position="relative" marginTop="0px !important">
      <HStack position="absolute" top="-40px" left="107px" display='flex' width={`calc(100% - 107px)`} className="tool-bar">
        <HStack flex='1'>
          <Button colorScheme="blue">Reset</Button>
          <Button
            onClick={() => handleDeleteRange(selectedFlatRows)}
            isDisabled={selectedFlatRows.length < 2}
            colorScheme="blue"
          >
            Delete Range
          </Button>
        </HStack>
        <HStack
          spacing="10px"
          display="flex"
          justifyContent="flex-end"
          width="100%"
        >
          <Flex alignItems="center">
            <Text fontWeight="semibold">
              Page {pageIndex + 1} of {pageCount}
            </Text>
          </Flex>
          <Button
            colorScheme="blue"
            onClick={() => gotoPage(0)}
            isDisabled={!canPreviousPage}
          >
            <Icon as={MdSkipPrevious} />
          </Button>
          <Button
            colorScheme="blue"
            onClick={() => previousPage()}
            isDisabled={!canPreviousPage}
          >
            Previous
          </Button>
          <Button
            colorScheme="blue"
            onClick={() => nextPage()}
            isDisabled={!canNextPage}
          >
            Next
          </Button>
          <Button
            colorScheme="blue"
            onClick={() => gotoPage(pageCount - 1)}
            isDisabled={!canNextPage}
          >
            <Icon as={MdSkipNext} />
          </Button>

          <Flex alignItems="center"  gap="5px">
            <Text fontWeight="semibold">Go to</Text>
            <Input
              flex="1"
              type="number"
              background="white"
              defaultValue={pageIndex + 1}
              onChange={(e) => debouncedGotoPage(e.target.value)}
            />
          </Flex>
          <Select
            width="200px"
            value={pageSize}
            background="white"
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
        </HStack>
      </HStack>
      <TableContainer border="1px solid gray" rounded="lg">
        <Table variant="simple" {...getTableProps()}>
          <Thead bgColor="#224562">
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  return (
                    <Th
                      textTransform="capitalize"
                      fontSize="lg"
                      color="white"
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
            {page.map((row) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <Td {...cell.getCellProps()}>
                        <Box
                          width={
                            cell.column.cellWidth
                              ? cell.column.cellWidth
                              : "none"
                          }
                          textOverflow="ellipsis"
                          overflow="hidden"
                        >
                          {cell.render("Cell")}
                        </Box>
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  );
}

export default ReactTableWithCharka;
