import React from 'react';
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { 
    Typography, Paper,
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

export default function Search(props) {
    const classes = useStyles();

    const [keyWord, setKeyWord] = React.useState(props.location.state.keyWord || " ");
    const [keySubject, setKeySubject] = React.useState(props.location.state.keySubject || " ");
    const [keyInstructor, setKeyInstructor] = React.useState(props.location.state.keyInstructor || " ");
/*
    const [keyWord, setKeyWord] = React.useState(" ");
    const [keySubject, setKeySubject] = React.useState(" ");
    const [keyInstructor, setKeyInstructor] = React.useState(" ");
*/
    
    // search result:
    const [result, saveResult] = React.useState([]);
    const [searchExecuted, setSearchExecuted] = React.useState(true);
    const [buttonCheck, buttonClick] = React.useState(false);

    // Search course info from backend given the entry:
    const searchByKeyWord = React.useCallback((currKeyWord) => {
        if (currKeyWord != " ") {

            const paramSearch = `/coursesearch/search/${currKeyWord}/ / / / / /`;
            console.log("Command for search controller: " + paramSearch);
            axios.get(paramSearch)
                .then((res) => {
                    console.log(res.data);
                    saveResult(res.data);
                    setSearchExecuted(true);
                })
                .catch((err) => {
                    alert("Search Loading Error.");
                });
        
        } else {
            saveResult([]); // Reset search result displayed
            setSearchExecuted(false);
        } 
    }, []);

    const searchByFilter = React.useCallback((currKeyWord, currKeySubj, currKeyInst) => {
        if (currKeyWord != " " || currKeySubj != " " || currKeyInst != " ") {
            
            const paramSearch = `/coursesearch/search/${currKeyWord}/${currKeySubj}/${currKeyInst}/ / / /`;
            console.log("Command for search controller: " + paramSearch);
            axios.get(paramSearch)
                .then((res) => {
                    console.log(res.data);
                    saveResult(res.data);
                    setSearchExecuted(true);
                })
                .catch((err) => {
                    alert("Search Loading Error.");
                });

        } else {
            saveResult([]); // Reset search result displayed
            setSearchExecuted(false);
        } 
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
        // Search with empty keyWord:
        //searchByFilter(" ", keySubj, keyInst);
    }


    // As default,
    // Enter page with keyWord=" " and display all courses:
    React.useEffect(() => {
        // if (props.location.state) {
        // }
        
        searchByFilter(keyWord, keySubject, keyInstructor);

    }, [searchByFilter, setSearchExecuted]);
    
    function addrConcat(cid) {
        var newAddr = "/course_";
        newAddr = newAddr.concat(cid);
        return newAddr;
    }


    function DisplaySearch() {
        return (
            <div>
                {result.map(resultItem => (
                    
                    <Link 
                        to={{
                            pathname: addrConcat(resultItem[0]).toString(),
                            state: {
                            "keyWord": keyWord, 
                            "keySubject": keySubject, 
                            "keyInstructor": keyInstructor,
                            },
                        }}
                        
                        style={{ textDecoration: 'none' }}
                        key={result.indexOf(resultItem)}
                    >
                        <Paper
                            className={classes.paper} 
                            style={{ padding:10, paddingLeft:20}}
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
            </div>
        );
    }

    
    function TestResult(currResult) {
        return (<div></div>);
    }    
    function TestKeyWord(currKeyWord) {
        return (<div></div>);
    }
    function TestKeySubject(currKeyWord) {
        return (<div></div>);
    }
    function TestKeyInstructor(currKeyWord) {
        return (<div></div>);
    }

    return (
        <div className = {classes.root}>
            
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
            
            <main className = {classes.contents}>
                <div>
                    { searchExecuted ? 
                        <Typography variant="h5">
                            Search Result for "{keyWord}"" 
                        </Typography>
                        : 
                        <Typography variant="h5">
                            Please enter search contents ~
                        </Typography>
                    }   
                    <DisplaySearch searchResult={result}/>
                </div>
            </main>
            
            <TestKeyWord value={keyWord}/>
            <TestKeySubject value={keySubject}/>
            <TestKeyInstructor value={keyInstructor}/>
            <TestResult value={result}/>
        </div>
    )
}