import { memo } from "react";
//export const dumbTableData =[]
export const dumbTableData = [
  {
    picture: "http://dummyimage.com/189x100.png/cc0000/ffffff",
    fullName: "Archibold",
    email: "ageed@liveinternet.ru",
    role: "Project Manager",
    phoneNumber: "943-358-0519",
    address: "Room 486 lorem55555555555555555555555555555555555555555555555555555555555555555dddddddddddddddddddddddddddddd5",
  },
  {
    picture: "http://dummyimage.com/199x100.png/dddddd/000000",
    fullName: "Mel Peabody",
    email: "mpeabodye@geocities.com",
    role: "Estimator",
    phoneNumber: "768-199-8269",
    address: "Room 822",
  },
  {
    picture: "http://dummyimage.com/118x100.png/ff4444/ffffff",
    fullName: "Micki Tween",
    email: "mtweenf@apache.org",
    role: "Engineer",
    phoneNumber: "778-366-0165",
    address: "Suite 94",
  },
  {
    picture: "http://dummyimage.com/240x100.png/ff4444/ffffff",
    fullName: "Archibold Delort",
    email: "adelortg@cbslocal.com",
    role: "Construction Manager",
    phoneNumber: "842-864-0585",
    address: "17th Floor",
  },
  {
    picture: "http://dummyimage.com/221x100.png/cc0000/ffffff",
    fullName: "Chandra Ciccone",
    email: "ccicconeh@blogs.com",
    role: "Construction Worker",
    phoneNumber: "706-958-0548",
    address: "6th Floor",
  },
  {
    picture: "http://dummyimage.com/230x100.png/ff4444/ffffff",
    fullName: "Hilary Kesten",
    email: "hkesteni@freewebs.com",
    role: "Project Manager",
    phoneNumber: "637-716-9596",
    address: "PO Box 46890",
  },
  {
    picture: "http://dummyimage.com/112x100.png/5fa2dd/ffffff",
    fullName: "Dani Adolf",
    email: "dadolfj@columbia.edu",
    role: "Estimator",
    phoneNumber: "196-923-9672",
    address: "Room 291",
  },
  {
    picture: "http://dummyimage.com/209x100.png/5fa2dd/ffffff",
    fullName: "Camala Glacken",
    email: "cglackenk@dedecms.com",
    role: "Electrician",
    phoneNumber: "713-121-3431",
    address: "8th Floor",
  },
  {
    picture: "http://dummyimage.com/189x100.png/cc0000/ffffff",
    fullName: "Archibold",
    email: "ageed@liveinternet.ru",
    role: "Project Manager",
    phoneNumber: "943-358-0519",
    address: "Room 486 ",
  },
  {
    picture: "http://dummyimage.com/199x100.png/dddddd/000000",
    fullName: "Mel Peabody",
    email: "mpeabodye@geocities.com",
    role: "Estimator",
    phoneNumber: "768-199-8269",
    address: "Room 822",
  },
  {
    picture: "http://dummyimage.com/118x100.png/ff4444/ffffff",
    fullName: "Micki Tween",
    email: "mtweenf@apache.org",
    role: "Engineer",
    phoneNumber: "778-366-0165",
    address: "Suite 94",
  },
  {
    picture: "http://dummyimage.com/240x100.png/ff4444/ffffff",
    fullName: "Archibold Delort",
    email: "adelortg@cbslocal.com",
    role: "Construction Manager",
    phoneNumber: "842-864-0585",
    address: "17th Floor",
  },
  {
    picture: "http://dummyimage.com/221x100.png/cc0000/ffffff",
    fullName: "Chandra Ciccone",
    email: "ccicconeh@blogs.com",
    role: "Construction Worker",
    phoneNumber: "706-958-0548",
    address: "6th Floor",
  },
  {
    picture: "http://dummyimage.com/230x100.png/ff4444/ffffff",
    fullName: "Hilary Kesten",
    email: "hkesteni@freewebs.com",
    role: "Project Manager",
    phoneNumber: "637-716-9596",
    address: "PO Box 46890",
  },
  {
    picture: "http://dummyimage.com/112x100.png/5fa2dd/ffffff",
    fullName: "Dani Adolf",
    email: "dadolfj@columbia.edu",
    role: "Estimator",
    phoneNumber: "196-923-9672",
    address: "Room 291",
  },
  {
    picture: "http://dummyimage.com/209x100.png/5fa2dd/ffffff",
    fullName: "Camala Glacken",
    email: "cglackenk@dedecms.com",
    role: "Electrician",
    phoneNumber: "713-121-3431",
    address: "8th Floor",
  },
  {
    picture: "http://dummyimage.com/189x100.png/cc0000/ffffff",
    fullName: "Archibold",
    email: "ageed@liveinternet.ru",
    role: "Project Manager",
    phoneNumber: "943-358-0519",
    address: "Room 486 ",
  },
  {
    picture: "http://dummyimage.com/199x100.png/dddddd/000000",
    fullName: "Mel Peabody",
    email: "mpeabodye@geocities.com",
    role: "Estimator",
    phoneNumber: "768-199-8269",
    address: "Room 822",
  },
  {
    picture: "http://dummyimage.com/118x100.png/ff4444/ffffff",
    fullName: "Micki Tween",
    email: "mtweenf@apache.org",
    role: "Engineer",
    phoneNumber: "778-366-0165",
    address: "Suite 94",
  },
  {
    picture: "http://dummyimage.com/240x100.png/ff4444/ffffff",
    fullName: "Archibold Delort",
    email: "adelortg@cbslocal.com",
    role: "Construction Manager",
    phoneNumber: "842-864-0585",
    address: "17th Floor",
  },
  {
    picture: "http://dummyimage.com/221x100.png/cc0000/ffffff",
    fullName: "Chandra Ciccone",
    email: "ccicconeh@blogs.com",
    role: "Construction Worker",
    phoneNumber: "706-958-0548",
    address: "6th Floor",
  },
  {
    picture: "http://dummyimage.com/230x100.png/ff4444/ffffff",
    fullName: "Hilary Kesten",
    email: "hkesteni@freewebs.com",
    role: "Project Manager",
    phoneNumber: "637-716-9596",
    address: "PO Box 46890",
  },
  {
    picture: "http://dummyimage.com/112x100.png/5fa2dd/ffffff",
    fullName: "Dani Adolf",
    email: "dadolfj@columbia.edu",
    role: "Estimator",
    phoneNumber: "196-923-9672",
    address: "Room 291",
  },
  {
    picture: "http://dummyimage.com/209x100.png/5fa2dd/ffffff",
    fullName: "Camala Glacken",
    email: "cglackenk@dedecms.com",
    role: "Electrician",
    phoneNumber: "713-121-3431",
    address: "8th Floor",
  },
  {
    picture: "http://dummyimage.com/189x100.png/cc0000/ffffff",
    fullName: "Archibold",
    email: "ageed@liveinternet.ru",
    role: "Project Manager",
    phoneNumber: "943-358-0519",
    address: "Room 486 ",
  },
  {
    picture: "http://dummyimage.com/199x100.png/dddddd/000000",
    fullName: "Mel Peabody",
    email: "mpeabodye@geocities.com",
    role: "Estimator",
    phoneNumber: "768-199-8269",
    address: "Room 822",
  },
  {
    picture: "http://dummyimage.com/118x100.png/ff4444/ffffff",
    fullName: "Micki Tween",
    email: "mtweenf@apache.org",
    role: "Engineer",
    phoneNumber: "778-366-0165",
    address: "Suite 94",
  },
  {
    picture: "http://dummyimage.com/240x100.png/ff4444/ffffff",
    fullName: "Archibold Delort",
    email: "adelortg@cbslocal.com",
    role: "Construction Manager",
    phoneNumber: "842-864-0585",
    address: "17th Floor",
  },
  {
    picture: "http://dummyimage.com/221x100.png/cc0000/ffffff",
    fullName: "Chandra Ciccone",
    email: "ccicconeh@blogs.com",
    role: "Construction Worker",
    phoneNumber: "706-958-0548",
    address: "6th Floor",
  },
  {
    picture: "http://dummyimage.com/230x100.png/ff4444/ffffff",
    fullName: "Hilary Kesten",
    email: "hkesteni@freewebs.com",
    role: "Project Manager",
    phoneNumber: "637-716-9596",
    address: "PO Box 46890",
  },
  {
    picture: "http://dummyimage.com/112x100.png/5fa2dd/ffffff",
    fullName: "Dani Adolf",
    email: "dadolfj@columbia.edu",
    role: "Estimator",
    phoneNumber: "196-923-9672",
    address: "Room 291",
  },
  {
    picture: "http://dummyimage.com/209x100.png/5fa2dd/ffffff",
    fullName: "Camala Glacken",
    email: "cglackenk@dedecms.com",
    role: "Electrician",
    phoneNumber: "713-121-3431",
    address: "8th Floor",
  },
];
export const roleCodeColor = [
  {
    "Project Manager": "green",
  },
  {
    Estimator: "red",
  },
  {
    Electrician: "purple",
  },
  {
    "Construction Worker": "orange",
  },
  {
    "Construction Manager": "blue",
  },
  {
    Engineer: "pink",
  },
];
const test = (row, action) => {
  row.action = action;
  console.log(row, action);
};
export const tableRowAction = [
  {
    actionName: "Edit",
    func: test,
  },
  {
    actionName: "Delete",
    func: test,
  },
];
