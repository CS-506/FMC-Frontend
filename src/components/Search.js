import React from 'react';
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography, Paper, Button,
} from "@material-ui/core/";
import { Link } from 'react-router-dom';
import NavBar from "./NavBar";

const useStyles = makeStyles(theme => ({
  navbar: {
    flexGrow: 1,
    zIndex: theme.zIndex.drawer + 1,
  },
  contents: {
    flexGrow: 1,
    paddingTop: theme.spacing(10),
    paddingLeft: theme.spacing(35),
  },
  paper: {
    margin: theme.spacing(2, 3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
  },
}));

function DisplaySearch(props) {
  const classes = useStyles();

  function addrConcat(cid) {
    var newAddr = "/course_";
    newAddr = newAddr.concat(cid);
    return newAddr;
  }

  if (props.isLoading) {
    return (
      <Typography variant="subtitle2">
        <br />
        Loading...
      </Typography>
    )
  }

  if (props.results.length === 0) {
    return (
      <Typography variant="subtitle2">
        <br />
        No results found.
      </Typography>
    );
  }

  return (
    <div>
      { props.results.map(resultItem => (
        <Link
          to={{
            pathname: addrConcat(resultItem[0]).toString(),
            state: {
              "keyWord": props.keyWord,
              "keySubject": props.keySubject,
              "keyInstructor": props.keyInstructor,
            },
          }}
          style={{ textDecoration: 'none' }}
          key={props.results.indexOf(resultItem)}
        >
          <Paper
            className={classes.paper}
            style={{ padding: 10, paddingLeft: 25 }}
          >
            <Typography variant="h5">
              {resultItem[2]}
            </Typography>
            <Typography variant="subtitle1">
              {resultItem[5]} {resultItem[1]}
            </Typography>
          </Paper>
        </Link>
      ))}
      <div
        className={classes.paper}
        style={{ marginLeft: 30, marginTop: 20 }}
      >
        {props.noMore ? (
          <Typography variant="subtitle2">
            All results loaded. ({props.results.length} total)
          </Typography>
        ) : (
            <Button
              size="small"
              onClick={props.loadMore}
              style={{ marginBottom: 500 }}
            >
              ({props.results.length}) Show more ...
            </Button>
          )
        }
      </div>
    </div>
  );
}

export default function Search(props) {
  const classes = useStyles();

  const [keyWord, setKeyWord] =
    React.useState(props.location.state.keyWord);
  const [keySubject, setKeySubject] =
    React.useState(props.location.state.keySubject);
  const [keyInstructor, setKeyInstructor] =
    React.useState(props.location.state.keyInstructor);

  const [isLoading, setIsLoading] = React.useState(true);
  /* The current result list */
  const [results, saveResult] = React.useState([]);
  /* The current pageno the search is at */
  const [pageno, setPageno] = React.useState(0);
  /* If there are more results to be fetched. */
  const [noMore, setNoMore] = React.useState(false);

  function search(keyword = " ", subj = " ", inst = " ",
    page = 0, sz = 25, sort = "code") {
    setIsLoading(true);
    const url = `/coursesearch/search/` +
      `${keyword}/${subj}/${inst}/${sort}/${page}/${sz}`;
    axios.get(url)
      .then((res) => {
        setIsLoading(false);
        let response = res.data;
        let newpg = page + response.length;
        setPageno(newpg);
        if (page === 0) {
          // New search terms, start fresh
          saveResult(response);
          setNoMore(false);
        } else {
          // building on old search, add to existing results
          let updatedResults = results.concat(response);
          saveResult(updatedResults);
        }
        if (response.length < sz)
          setNoMore(true);
      })
      .catch((err) => {
        alert("Search Loading Error.");
      });
  }

  const searchNewPage = React.useCallback(() => {
    search(keyWord, keySubject, keyInstructor, pageno);
  }, [results, pageno])

  // Search course info from backend given the entry:
  const searchByKeyWord = React.useCallback((currKeyWord) => {
    search(currKeyWord);
  }, []);

  const searchByFilter = React.useCallback((keyword, subj, inst) => {
    search(keyword, subj, inst);
  }, []);

  // Update keyWord from NavBar's search box:
  function transferKey(key) {
    // Let default key be " " 
    // so that controller returns all courses instead of none:
    if (key == "") {
      key = " ";
    }
    // Store the keyWord passed:
    setKeyWord(key);

    // Initiate search every time keyWord changes:
    searchByKeyWord(key);
  };

  function transferFilter(keySubj, keyInst) {
    // Store the filters passed:
    setKeySubject(keySubj);
    setKeyInstructor(keyInst);

    // Initiate search every time filters changes:
    // Two options:
    // Search within the previous search result of keyWord:
    searchByFilter(keyWord, keySubj, keyInst);
  }

  // As default,
  // Enter page with keyWord=" " and display all courses:
  React.useEffect(() => {
    searchByFilter(keyWord, keySubject, keyInstructor);
  }, [searchByKeyWord]);

  return (
    <div className={classes.root}>

      <div>
        <NavBar
          sendKey={transferKey}
          sendFilter={transferFilter}
          logout={props.logout}
          loginStat={props.loginStat}
          user={props.user}
          atSearchPage={true}
        />
      </div>

      <main className={classes.contents}>
        <div>
          <Typography variant="h5">
            Search Result for  "{keyWord}"
          </Typography>

          <DisplaySearch
            results={results}
            keyWord={keyWord}
            keySubject={keySubject}
            keyInstructor={keyInstructor}
            noMore={noMore}
            loadMore={searchNewPage}
            isLoading={isLoading && pageno === 0}
          />
        </div>
      </main>
    </div>
  )
}
