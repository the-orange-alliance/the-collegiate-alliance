import React, {useEffect} from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import { AppRoute } from "../AppRoutes";
import {Link, NavLink, useHistory} from "react-router-dom";

import POWERED_BY_TOA from "../assets/powered_by_toa.png";
import CalendarTodayIcon from "@material-ui/icons/CalendarTodayTwoTone";

const drawerWidth = 220;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      marginLeft: drawerWidth,
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
      },
    },
    logo: {
      maxWidth: '100%',
      height: 'auto'
    },
    sponsor: {
      padding: theme.spacing(2),
      maxWidth: '100%',
      height: 'auto'
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1
    }
  }),
);

interface ResponsiveDrawerProps {
  appRoutes: AppRoute[];
  container?: Element;
  title?: string;
  logo?: any;
  view: JSX.Element;
}

export default function ResponsiveDrawer(props: ResponsiveDrawerProps) {
  const { appRoutes, container, title, logo, view } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const history = useHistory();

  const displaySeasons: {name: string, seasonKey: string}[] = [
    {name: "2022 Event", seasonKey: "22"},
    {name: "2020 Event", seasonKey: "20"},
  ];

  useEffect(() => {
    const path = new URLSearchParams(location.search).get("path");
    history.push(path ? path : "");
  }, [])

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }

  const menuItems = appRoutes.filter((route: AppRoute) => typeof route.menuIcon !== "undefined").map((route: AppRoute) => {
    return (
      <NavLink key={route.name} to={route.path} exact={route.exact} activeClassName={"nav-active"}>
        <ListItem button={true} key={route.path}>
          <ListItemIcon>{route.menuIcon ? route.menuIcon : <MenuIcon/>}</ListItemIcon>
          <ListItemText primary={route.name} />
        </ListItem>
      </NavLink>
    );
  });

  const drawer = (
    <div>
      <div className={classes.toolbar}>
        {logo ? <img src={logo} alt={'FACC Logo'} className={classes.logo}/> : title}
      </div>
      <Divider />
      <List>
        {menuItems}
        {displaySeasons.map(season => (
          <NavLink key={season.seasonKey} to={`/events/${season.seasonKey}`} exact={true} activeClassName={"nav-active"}>
            <ListItem button={true}>
              <ListItemIcon><CalendarTodayIcon/></ListItemIcon>
              <ListItemText primary={season.name} />
            </ListItem>
          </NavLink>
        ))
        }
      </List>
      <Divider />
      <div>
        <a href="https://theorangealliance.org/">
          <img src={POWERED_BY_TOA} className={classes.sponsor} alt={"powered by TOA logo"}/>
        </a>
      </div>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {title ? title : "Responsive drawer"}
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {view}
      </main>
    </div>
  );
}
