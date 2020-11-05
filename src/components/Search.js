import React, { useContext } from 'react';
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { 
    Typography,
    Grid,
    Paper,
    List,
} from "@material-ui/core/";
import { Link } from 'react-router-dom';
import NavBar from "./NavBar";
import { AppContext } from './Home';

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

export default function Search({ key }) {
    const classes = useStyles();

    // search keywords:
    const [keyWord, setKeyWord] = React.useState(" ");
    // search keywords:
    const [confirmedKeyWord, setConfKeyWord] = React.useState("");
    // search result:
    const [result, saveResult] = React.useState([]);
    
    const [buttonCheck, buttonClick] = React.useState(false);

    // Search course info from backend given the entry:
    const searchCourse = React.useCallback((currKeyWord) => {
        const paramSearch = `/coursesearch/search/${currKeyWord}/ / / / /`;
        console.log("from searchCourse func:" + paramSearch);
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
        setKeyWord(key);
        
        // Initiate search every time keyWord changes:
        searchCourse(keyWord);
    };

    /*
    React.useEffect(() => {
        searchCourse(keyWord);
        setLoading(false);  
    }, [searchCourse]);
    */

    function DisplaySearch() {
        return (
            <div>
                {result.map(resultItem => (
                    <Link to="/course" style={{ textDecoration: 'none' }}>
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
                <NavBar sendKey={transferKey}/>
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