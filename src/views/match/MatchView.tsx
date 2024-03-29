import * as React from "react";
import {RouteComponentProps} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import AppTheme, {CURRENT_SEASON, CURRENT_SEASON_NAME} from "../../AppTheme";
import MatchCardModule from "../../modules/MatchCardModule";
import FRC20DetailCard from "../../components/game-specific/FRC20DetailCard";

import {ApplicationActions, ISetCompleteMatch, setCompleteMatch} from "../../store/Actions";
import {IApplicationState} from "../../store/Models";
import {Dispatch} from "redux";
import {connect} from "react-redux";

import {FGCProvider, Match} from "@the-orange-alliance/lib-ems";
import FRC22DetailCard from "../../components/game-specific/FRC22DetailCard";

const styles = {
  container: {
    margin: 0,
    paddingTop: AppTheme.spacing(3)
  }
};

interface IProps {
  routeProps: RouteComponentProps;
  completeMatch: Match;
  setCompleteMatch: (match: Match) => ISetCompleteMatch;
}

class MatchView extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public componentDidMount() {
    const {routeProps, setCompleteMatch} = this.props;
    if (typeof (routeProps.match.params as any).matchKey !== "undefined") {
      FGCProvider.getCompleteMatch((routeProps.match.params as any).matchKey).then((match: Match) => {
        console.log("meep", match);
        setCompleteMatch(match);
      });
    }
  }

  public render() {
    const {completeMatch} = this.props;
    return (
      <Container maxWidth={false} style={styles.container}>
        <Typography variant={'h3'}>{completeMatch.matchName}</Typography>
        <Typography variant={'h4'}>FACC {CURRENT_SEASON_NAME} 20{CURRENT_SEASON}</Typography>
        <Grid container={true} spacing={3}>
          <Grid item={true} xs={12} sm={12} md={6}>
            <MatchCardModule match={completeMatch}/>
          </Grid>
          <Grid item={true} xs={12} sm={12} md={6}>
            {completeMatch.matchKey.startsWith("20-") &&
              <FRC20DetailCard match={completeMatch}/>
            }
            {completeMatch.matchKey.startsWith("22-") &&
              <FRC22DetailCard match={completeMatch}/>
            }
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export function mapStateToProps(state: IApplicationState) {
  return {
    completeMatch: state.completeMatch
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setCompleteMatch: (match: Match) => dispatch(setCompleteMatch(match))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchView);
