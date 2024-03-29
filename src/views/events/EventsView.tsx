import * as React from "react";
import {Route, RouteComponentProps} from "react-router-dom";
import AppTheme, {CURRENT_SEASON} from "../../AppTheme";
import Container from "@material-ui/core/Container";
import EventView from "../event/EventView";

import {
  ApplicationActions, ISetEvent, ISetMatches, ISetRankings, ISetTeams, setEvent, setMatches, setRankings,
  setTeams
} from "../../store/Actions";
import {IApplicationState} from "../../store/Models";
import {Dispatch} from "redux";
import {connect} from "react-redux";

import {Event, EventType, FGCProvider, Ranking, Team, Match} from "@the-orange-alliance/lib-ems";

const styles = {
  container: {
    padding: AppTheme.spacing(1)
  }
};

interface IProps {
  routeProps: RouteComponentProps;
  event: Event;
  matches: Match[];
  rankings: Ranking[];
  teams: Team[];
  setEvent: (event: Event) => ISetEvent;
  setMatches: (matches: Match[]) => ISetMatches;
  setTeams: (teams: Team[]) => ISetTeams;
  setRankings: (rankings: Ranking[]) => ISetRankings;
}

interface IState {
  seasonKey: string
}

class EventsView extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      seasonKey: CURRENT_SEASON
    };
  }

  public componentWillMount() {
    // tslint:disable-next-line:no-shadowed-variable
    const {routeProps, matches, event, teams, setTeams, setEvent, setMatches, setRankings} = this.props;
    const {seasonKey} = this.state;
    if (typeof event.eventCode === "undefined" || event.eventCode.length <= 0) {
      const routeKey: string = (routeProps.match.params as any).seasonKey;
      const key: string = routeKey ? routeKey : seasonKey;
      FGCProvider.getEventBySeason(key).then((newEvent: Event) => {
        setEvent(newEvent);
        FGCProvider.getAllEventMatches(newEvent.eventKey).then((newMatches: Match[]) => {
          setMatches(newMatches.filter((m: Match) => m.tournamentLevel > Match.PRACTICE_LEVEL));
        });
        FGCProvider.getTeams(newEvent.eventKey).then((newTeams: Team[]) => {
          setTeams(newTeams);
        });
        FGCProvider.getRankingTeams(newEvent.eventKey, getEventTypeFromKey(newEvent.season.seasonKey.toString())).then((rankings: Ranking[]) => {
          setRankings(rankings);
        });
      });
    } else if (matches.length <= 0) {
      FGCProvider.getAllEventMatches(event.eventKey).then((newMatches: Match[]) => {
        setMatches(newMatches);
      });
    } else if (teams.length <= 0) {
      FGCProvider.getTeams(event.eventKey).then((newTeams: Team[]) => {
        setTeams(newTeams);
      });
    }
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    // tslint:disable-next-line:no-shadowed-variable
    const {routeProps, event, setTeams, setEvent, setMatches, setRankings} = this.props;
    const seasonKey: string = (routeProps.match.params as any).seasonKey;
    if(!seasonKey && !prevState.seasonKey) {return;} // avoid excess executions during state transitions
    if (seasonKey && seasonKey !== prevState.seasonKey) {
      FGCProvider.getEventBySeason(seasonKey).then((newEvent: Event) => {
        setEvent(newEvent);
        Promise.all([
          FGCProvider.getAllEventMatches(event.eventKey).then((matches: Match[]) => {
            setMatches(matches);
          }),
          FGCProvider.getTeams(event.eventKey).then((teams: Team[]) => {
            setTeams(teams);
          }),
          FGCProvider.getRankingTeams(event.eventKey, getEventTypeFromKey(event.season.seasonKey.toString())).then((rankings: Ranking[]) => {
            setRankings(rankings);
          }),
        ]);
      }).then(() => {
        this.setState({seasonKey: seasonKey})
      });
    }
  }

  public render() {
    const {event, matches, teams, rankings} = this.props;
    return (
      <Container style={styles.container}>
        <EventView event={event} matches={matches} teams={teams} rankings={rankings}/>
      </Container>
    );
  }
}

export function getEventTypeFromKey(seasonKey: string): EventType | undefined {
  switch (seasonKey) {
    case "20":
      return "frc_20";
    default:
      return undefined;
  }
}

export function mapStateToProps(state: IApplicationState) {
  return {
    event: state.event,
    matches: state.matches,
    teams: state.teams,
    rankings: state.rankings
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setEvent: (event: Event) => dispatch(setEvent(event)),
    setMatches: (matches: Match[]) => dispatch(setMatches(matches)),
    setTeams: (teams: Team[]) => dispatch(setTeams(teams)),
    setRankings: (rankings: Ranking[]) => dispatch(setRankings(rankings))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventsView);
