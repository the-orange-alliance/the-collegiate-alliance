import * as React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import AppTheme, {CURRENT_SEASON} from "../AppTheme";
import Typography from "@material-ui/core/Typography";

import {Team} from "@the-orange-alliance/lib-ems";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import TeamImage from "./TeamImage";

const styles = {
  avatar: {
    margin: AppTheme.spacing(1),
    //padding: AppTheme.spacing(1),
    border: `1px solid ${AppTheme.palette.secondary.main}`,
    width: AppTheme.spacing(7),
    height: AppTheme.spacing(7),
  },
  text: {
    margin: AppTheme.spacing(1)
  }
};

interface IProps {
  team: Team
}

class TeamPaper extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const {team} = this.props;
    return (
      <Paper>
        <Link to={`/team/${team.teamKey}`}>
          <Button fullWidth={true}>
            <Grid container={true} spacing={1}>
              <Grid item={true} xs={3} sm={3} md={3}>
                <Avatar style={styles.avatar}>
                  <TeamImage team={team}/>
                </Avatar>
              </Grid>
              <Grid item={true} xs={9} sm={9} md={9}>
                <Grid container={true} spacing={0} style={styles.text}>
                  <Grid item={true} xs={12}>
                    <Typography display={'inline'} variant={'body1'}><b>{team.teamNameShort}</b></Typography>
                  </Grid>
                  <Grid item={true} xs={12}>
                    <Typography variant={'body2'} color={"textSecondary"}>{team.teamNameLong}</Typography>
                  </Grid>
                  <Grid item={true} xs={12}>
                    <Typography variant={'body2'} color={"textSecondary"}><b>{team.city}, {team.stateProv}</b></Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Button>
        </Link>
      </Paper>
    );
  }
}

export default TeamPaper;
