import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import TableComponent from "./TableComponent";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { CSVLink } from "react-csv";
import GradeIcon from "@mui/icons-material/Grade";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import axios from "axios";
import { Tooltip, IconButton } from "@mui/material";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.75),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.6),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
  color: "#34383c",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "gray",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
    border: "2px solid #c5cfe3",
    "&:hover": {
      border: "2px solid #6AAEC6",
    },
    borderRadius: "5px",
    color: "#34383c",
  },
}));

const SearchBar = ({ data, filter, email }) => {
  const [search, setSearch] = React.useState("");
  const [tableData, setData] = React.useState({ nodes: data });
  const [isdataSorted, setDataSorted] = React.useState(0);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [csvData, setCsvData] = React.useState([]);
  const [isFavSet, setFav] = React.useState(false);

  React.useEffect(() => {
    if (search.length > 0) {
      const filteredData = {
        nodes: data.filter((item) =>
          item.id.toString().includes(search.toLowerCase())
        ),
      };
      setData(filteredData);
    } else {
      setData({ nodes: data });
    }
  }, [search, data]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  // Function to update 'tableData' state after delete operation
  const updateTableData = (updatedData) => {
    setData({ nodes: updatedData });
  };

  const compare = (a, b) => {
    a = a.maturitydate.split("-").join("");
    b = b.maturitydate.split("-").join("");
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  };

  const sortByDate = () => {
    let sortedData = {
      nodes: data.sort(compare),
    };

    if (isdataSorted === 0) {
      setDataSorted(1);
    } else if (isdataSorted < 0) {
      setDataSorted(1);
    } else {
      sortedData = {
        nodes: data.sort(compare).reverse(),
      };
      setDataSorted(-1);
    }
    setData(sortedData);
  };

  const addToFavorite = async () => {
    setFav(!isFavSet);
    selectedItems.map(async (item) => {
      const id = item.id;
      try {
        const response = await axios.post(
          "http://localhost:9090/bonds/security/fav",
          {
            id,
          }
        );
        if (response.data === "invalid") {
          alert("Invalid Credentials! Please try again");
        } else {
          console.log("added", id);
        }
      } catch (error) {
        console.log("error");
      }
      // fetch(`http://localhost:9090/bonds/security/fav?id=${item.id}`, {
      //   mode: "cors",
      //   credentials: "include",
      //   headers: {
      //     Accept: "application/json, text/plain, */*",
      //     "Content-type": "application/json",
      //   },
      // })
      //   .then((response) => response.json())
      //   .then((responseData) => {
      //     console.log(responseData);
      //   })
      //   .catch((error) => {
      //     console.error("Error sending data:", error);
      //   });
    });
  };

  return (
    <>
      <Box
        sx={{ flexGrow: 1 }}
        height={"fit-content"}
        backgroundColor={"lightgrey"}
        style={{ borderRadius: "2px" }}
      >
        <Toolbar style={{ paddingLeft: "0.00001em", paddingRight: "1.3em" }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search by Security ID"
              inputProps={{ "aria-label": "search" }}
              id="search"
              type="text"
              onChange={handleSearch}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex", columnGap: "0.5em" } }}>
            {selectedItems.length > 0 ? (
              <Tooltip title="Add to favorites">
                <IconButton
                  color="#34383c"
                  size="small"
                  onClick={addToFavorite}
                >
                  {isFavSet ? <GradeIcon /> : <StarBorderIcon />}
                </IconButton>
              </Tooltip>
            ) : null}
            <Tooltip title="Sort by maturity date">
              <IconButton size="small" onClick={sortByDate} color="#34383c">
                {isdataSorted === 0 ? (
                  <SwapVertIcon />
                ) : isdataSorted < 0 ? (
                  <ArrowDownwardIcon />
                ) : (
                  <ArrowUpwardIcon />
                )}
              </IconButton>
            </Tooltip>
            <CSVLink
              className="downloadbtn"
              filename="my-file.csv"
              data={csvData}
            >
              <Tooltip title="Export to CSV">
                <IconButton size="small" color="#34383c">
                  <UpgradeIcon />
                </IconButton>
              </Tooltip>
            </CSVLink>
          </Box>
        </Toolbar>
      </Box>
      <TableComponent
        data={tableData.nodes}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        filter={filter}
        setCsvData={setCsvData}
        updateTableData={updateTableData}
      />
    </>
  );
};

export default SearchBar;
