import * as React from "react";
import {RouteComponentProps} from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";
import PeopleIcon from "@material-ui/icons/People";
import CalendarTodayIcon from "@material-ui/icons/CalendarTodayTwoTone";
import CameraIcon from "@material-ui/icons/VideocamRounded";
import ListIcon from '@material-ui/icons/List';

import HomeView from "./views/home/HomeView"
import TeamsView from "./views/teams/TeamsView";
import EventsView from "./views/events/EventsView";
import FRC2020View from "./views/events/OldSeasons/frc20";
import StreamingView from "./views/streaming/StreamingView";
import MatchView from "./views/match/MatchView";
import TeamView from "./views/team/TeamView";
import RankingsView from "./views/rankings/RankingsView"
import {CURRENT_SEASON} from "./AppTheme";

// tslint:disable-next-line:interface-name
export interface AppRoute {
  name: string;
  path: string;
  exact?: boolean;
  component: (routeProps: RouteComponentProps) => JSX.Element;
  menuIcon?: any;
}

// @ts-ignore
const appRoutes: AppRoute[] = [
  {
    name: "Home",
    path: '/',
    exact: true,
    component: () => <HomeView/>, // DEBUG view
    menuIcon: <HomeIcon/>
  },
  {
    name: "Teams",
    path: '/teams',
    exact: true,
    component: () => <TeamsView/>,
    menuIcon: <PeopleIcon/>
  },
  {
    name: "Rankings",
    path: '/rankings',
    component: () => <RankingsView/>,
    menuIcon: <ListIcon/>
  },
  {
    name: "20" + CURRENT_SEASON + " Event",
    path: '/events',
    exact: false,
    component: (routeProps: RouteComponentProps) => <EventsView routeProps={routeProps}/>,
    menuIcon: <CalendarTodayIcon/>
  },/* TODO: Revisit and fix
  {
    name: "2020 Event",
    path: '/2020',
    exact: false,
    component: (routeProps: RouteComponentProps) => <FRC2020View routeProps={routeProps}/>,
    menuIcon: <CalendarTodayIcon/>
  }*/,
  {
    name: "Streaming",
    path: '/streams',
    exact: true,
    component: () => <StreamingView/>,
    menuIcon: <CameraIcon/>
  },
  {
    name: "Match",
    path: '/match/:matchKey',
    exact: false,
    component: (routeProps: RouteComponentProps) => <MatchView routeProps={routeProps}/>
  },
  {
    name: "Team",
    path: '/team/:teamKey',
    component: (routeProps: RouteComponentProps) => <TeamView routeProps={routeProps}/>
  }
];

export default appRoutes;
