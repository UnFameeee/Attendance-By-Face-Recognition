import React, { useState } from "react";
import { Button, Space, Table, Popconfirm, Drawer, Modal } from "antd";
import { Avatar, Box, Icon } from "@chakra-ui/react";
import { Button as ChakraButton } from "@chakra-ui/react";
import { anTDTableDumpData } from "../pages/test/dumbTableData";
import { MdDeleteForever, MdModeEdit } from "react-icons/md";
import { Helper } from "../Utils/Helper";
import AntDDrawver from "./AntDDrawver";
function AntdTable() {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const columns = [
    {
      title: "Action",
      key: "action",
      filteredValue: filteredInfo.action || null,
      render: (_, record) => (
        <Space size="middle">
          <ChakraButton
            onClick={showDrawer}
            variant="outline"
            colorScheme="messenger"
          >
            <Icon boxSize="1.2rem" as={MdModeEdit} />
          </ChakraButton>
          <AntDDrawver open={open} setOpen={setOpen} />
          <Popconfirm
            title="Delete the record"
            description="Are you sure to delete this record?"
            onConfirm={() => confirm(record)}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <ChakraButton variant="outline" colorScheme="orange">
              <Icon boxSize="1.2rem" as={MdDeleteForever} />
            </ChakraButton>
          </Popconfirm>
        </Space>
      ),
      width: "10px",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      filters: [
        {
          text: "Cinderella Crowhurst",
          value: "Cinderella Crowhurst",
        },
        {
          text: "Jim",
          value: "Jim",
        },
      ],
      filterMode: "menu",
      filterSearch: true,
      filteredValue: filteredInfo.fullName || null,
      render: (text) => <a>{text}</a>,
      onFilter: (value, record) => record.fullName.indexOf(value) === 0,
      sorter: (a, b) => a.fullName.length - b.fullName.length,
      sortOrder: sortedInfo.columnKey === "fullName" ? sortedInfo.order : null,
    },
    {
      title: "Picture",
      key: "picture",
      dataIndex: "picture",
      filteredValue: filteredInfo.picture || null,
      onFilter: (value, record) => record.picture.indexOf(value) === 0,
      render: (record) => <Avatar src={record} />,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      filteredValue: filteredInfo.role || null,
      onFilter: (value, record) => record.role.indexOf(value) === 0,
      sorter: (a, b) => a.role.length - b.role.length,
      sortOrder: sortedInfo.columnKey === "role" ? sortedInfo.order : null,
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      filteredValue: filteredInfo.phoneNumber || null,
      onFilter: (value, record) => record.phoneNumber.indexOf(value) === 0,
      sorter: (a, b) => a.phoneNumber.length - b.phoneNumber.length,
      sortOrder:
        sortedInfo.columnKey === "phoneNumber" ? sortedInfo.order : null,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      filteredValue: filteredInfo.address || null,
      onFilter: (value, record) => record.address.indexOf(value) === 0,
      sorter: (a, b) => a.address.length - b.address.length,
      sortOrder: sortedInfo.columnKey === "address" ? sortedInfo.order : null,
    },
  ];
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      setSelectedRowKeys(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };
  const handleChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const confirm = (record) => {
    console.log(record);
  };
  const cancel = (e) => {
    console.log(e);
  };
  const showDrawer = () => {
    setOpen(true);
    var query =
      "div .ant-drawer.ant-drawer-right.css-dev-only-do-not-override-10ed4xt.ant-drawer-open";
    var indicatorQuery =
      "div .ant-drawer.ant-drawer-right.css-dev-only-do-not-override-10ed4xt.ant-drawer-open .ant-drawer-content-wrapper .table-action-drawer";
    Helper.RemoveDuplicateDivs(query, indicatorQuery);
  };
  const onClose = () => {
    setOpen(false);
  };
  const handleEdit = (record) => {
    console.log(record);
  };
  return (
    <>
      <Space>
        <ChakraButton colorScheme="teal" onClick={clearAll}>
          Clear filters and sorters
        </ChakraButton>
        {selectedRowKeys.length > 1 && (
          <>
            <ChakraButton
              colorScheme="orange"
              onClick={() => {
                setModalOpen(true);
              }}
            >
              Range Delete
            </ChakraButton>
            <Modal
              title="Are you sure to delete these record?"
              centered
              open={modalOpen}
              onOk={() => {
                setModalOpen(false);
                console.log(selectedRowKeys);
              }}
              onCancel={() => setModalOpen(false)}
            ></Modal>
          </>
        )}
      </Space>
      <Table
        columns={columns}
        dataSource={anTDTableDumpData}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        onChange={handleChange}
      />
    </>
  );
}

export default AntdTable;
