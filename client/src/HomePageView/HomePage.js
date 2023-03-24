import { AppBar, Toolbar, Grid, Typography, Button, Container, colors } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(4),
    },
    title:{
        fontSize: '4rem',
        fontWeight: 700,       
    },
    column1: {
        paddingLeft: 50,
    },
    column2: {
        paddingLeft: theme.spacing(2),
    },
    card: {
        borderRadius: theme.shape.borderRadius 
    },
    media: {
        height: 0,
        paddingTop: "56.25%", // 16:9 aspect ratio
    },
}));
const HomePage = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Grid container spacing={4} justifyContent="center" alignItems="center">
                <Grid item sm={4} className={classes.column1}>
                    <Typography variant="h3"  className={classes.title} gutterBottom>
                        Academic Team Management
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        We are a company that specializes in managing academic teams.
                    </Typography>
                </Grid>
                <Grid item  sm={4} className={classes.column2}>
                    <Card className={classes.card} style={{boxShadow: '0px 3px 5px rgba(0,0,0,0.2)'}}>
                        <CardMedia
                            className={classes.media}
                            image="https://source.unsplash.com/random"
                            title="Random image"
                        />
                    </Card>
                </Grid>
            </Grid>
        </div>

    )
}

export default HomePage