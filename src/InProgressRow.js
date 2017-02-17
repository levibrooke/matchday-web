import React from 'react';
import moment from 'moment'
import shapegreen from './images/shapegreen.svg'
import subon from './images/subon.svg';
import suboff from './images/suboff.svg';
import Event from './Event';

class InProgressRow extends React.Component {
  render(){

    var match = this.props.match;
    var homeClub = match.homeClub;
    var visitorClub = match.visitorClub;
    var homeClubCrestUrl = match.homeClub.crest;
    var homeClubCrestStyle = {
            backgroundImage: 'url(' + homeClubCrestUrl + ')'
        }
    var visitorClubCrestUrl = match.visitorClub.crest;
    var visitorClubCrestStyle = {
            backgroundImage: 'url(' + visitorClubCrestUrl + ')'
        }
    var expanderStyle = {
      backgroundImage: "url(" + shapegreen + ")"
    }
    var matchDate = moment.utc(match.matchTime).local().format('ddd M/D h:mma').toUpperCase();
    var postMatchDetails = match.preMatchDetails;

    if(match.inMatchDetails){
      postMatchDetails = match.inMatchDetails;
    }
    else if(match.postMatchDetails){
      postMatchDetails = match.postMatchDetails
    }

    var matchStatus = match.status.description;
    if(match.status.description == "In Progress"){
      matchStatus = match.timer + "'";
    }

    return (
              <div className="match w-clearfix">
                <div className="numberbg">
                  <div className="numberplace">{match.sortOrder}</div>
                </div>
                <div className="contentcontainer">
                  <div className="livescore">
                    <div className="homescore">{match.homeClubScore}</div>
                    <div className="homecrest homescore" style={homeClubCrestStyle}></div>
                    <div className="homescore scoretime">{matchStatus}</div>
                    <div className="awaycrest homescore"  style={visitorClubCrestStyle}></div>
                    <div className="awayscore">{match.visitorClubScore}</div>
                  </div>
                  <div className="livenarrative livenarrativecomplete narrative">{postMatchDetails}</div>
                  <Event />
                </div>
                <div className="expander" style={expanderStyle} ></div>
              </div>
    );
  }
}

export default InProgressRow;