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

    const [keyWord, setKeyWord] = React.useState(props.location.state.keyWord);
    const [keySubject, setKeySubject] = React.useState(props.location.state.keySubject);
    const [keyInstructor, setKeyInstructor] = React.useState(props.location.state.keyInstructor);

    // search result:
    const [result, saveResult] = React.useState([]);
    
    // Search course info from backend given the entry:
    const searchByKeyWord = React.useCallback((currKeyWord) => {
        const paramSearch = `/coursesearch/search/${currKeyWord}/ / / /`;
        console.log("Command for search controller: " + paramSearch);
        axios.get(paramSearch)
            .then((res) => {
                console.log(res.data);
                saveResult(res.data);
            })
            .catch((err) => {
                alert("Search Loading Error.");
            });
    }, []);

    const searchByFilter = React.useCallback((currKeyWord, currKeySubj, currKeyFilter) => {
        const paramSearch = `/coursesearch/search/${currKeyWord}/${currKeySubj}/${currKeyFilter}/ /`;
        console.log("Command for search controller: " + paramSearch);
        axios.get(paramSearch)
            .then((res) => {
                console.log(res.data);
                saveResult(res.data);
            })
            .catch((err) => {
                alert("Search Loading Error.");
            });
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
    }, [searchByKeyWord]);
    
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
                                {resultItem[3]}
                            </Typography>
                            <Typography variant="subtitle1">
                                {resultItem[1]} {resultItem[2]}
                            </Typography>
                        </Paper>
                    </Link>
                ))}
            </div>
        );
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
                    <Typography variant="h5">
                        Search Result for  "{keyWord}"
                    </Typography>

                    <DisplaySearch />
                </div>
            </main>
        </div>
    )
}