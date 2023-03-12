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
  Image,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { FiMoreVertical } from "react-icons/fi";
import { GrPrevious, GrNext } from "react-icons/gr";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import avt_test from "../assets/ta.jpeg";
import debounce from "lodash/debounce";
import ChakraAlertDialog from "./ChakraAlertDialog";
import { Helper } from "../Utils/Helper";
const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
);
function ReactTableWithCharka(props) {
  const { data, columns, handleDeleteRange, onAddEditOpen, tableRowAction } =
    props;
  const debouncedGotoPage = debounce((value) => {
    const pageNumber = value ? Number(value) - 1 : 0;
    gotoPage(pageNumber);
  }, 500);
  const {
    isOpen: isDeleteRangeOpen,
    onOpen: onDeleteRangeOpen,
    onClose: onDeleteRangeClose,
  } = useDisclosure();
  const handleDeleteRangeAlertAccept = () => {
    onDeleteRangeClose();
    handleDeleteRange(selectedFlatRows);
  };
  const {
    headerGroups,
    rows,
    page,
    selectedFlatRows,
    nextPage,
    previousPage,
    gotoPage,
    canNextPage,
    canPreviousPage,
    pageCount,
    setPageSize,
    state: { pageIndex, pageSize },
    getTableProps,
    getTableBodyProps,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "action",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <Flex gap="5px">
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()}  />
              <Text>Action</Text>
            </Flex>
          ),
          Cell: ({ row }) => (
            <HStack>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} type="checkbox" />
              <Menu>
                <MenuButton colorScheme="blue" variant="outline" as={Button}>
                  <Icon as={FiMoreVertical} />
                </MenuButton>
                <MenuList>
                  {tableRowAction.map((item) => {
                    return (
                      <MenuItem
                        key={item.actionName}
                        onClick={() => item.func(row?.values, item.actionName)}
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
    <Stack marginTop="0px !important">
      <HStack display="flex" width="100%" className="tool-bar">
        <HStack>
          <Button colorScheme="blue" onClick={onAddEditOpen}>
            Add New
          </Button>
          <Button colorScheme="blue">Reset</Button>
          <Button
            onClick={onDeleteRangeOpen}
            isDisabled={selectedFlatRows.length < 2}
            colorScheme="blue"
          >
            Delete Range
          </Button>
          <ChakraAlertDialog
            isOpen={isDeleteRangeOpen}
            onClose={onDeleteRangeClose}
            onAccept={handleDeleteRangeAlertAccept}
            title={`Delete ${selectedFlatRows.length} items`}
          />
        </HStack>
        <HStack
          spacing="10px"
          display="flex"
          justifyContent="flex-end"
          width="100%"
          flex="1"
        >
          <Flex alignItems="center">
            <Text fontWeight="semibold">
              {pageIndex + 1}/{pageCount} {pageCount > 1 ? "pages" : "page"}
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

          <Flex alignItems="center" gap="5px">
            <Text fontWeight="semibold">Go to</Text>
            <Input
              flex="1"
              type="number"
              background="white"
              width="70px"
              defaultValue={pageIndex + 1}
              onChange={(e) => debouncedGotoPage(e.target.value)}
            />
          </Flex>
          <Select
            width="150px"
            value={pageSize}
            background="white"
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[25, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
            <option key={data.length} value={data.length}>
              Show All
            </option>
          </Select>
        </HStack>
      </HStack>
      <TableContainer rounded="lg">
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
          <Tbody width="100%" bgColor="white" {...getTableBodyProps()}>
            {rows?.length > 0 &&
              page.map((row, index) => {
                prepareRow(row);
                return (
                  <Tr
                    bg={!Helper.isOdd(index) ? "#e1e8ef" : "none"}
                    {...row.getRowProps()}
                  >
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
