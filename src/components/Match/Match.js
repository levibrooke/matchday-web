import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import MoreInfo from './MoreInfo';
import seconds from './images/seconds.gif';
import renderHTML from 'react-render-html';

export default class Match extends Component {

  state = {
    expanded: false,
    matchType: null
  }

  componentDidMount() {
    this.setMatchType();
  }

  setMatchType = () => {
    const { match } = this.props;
    let matchType = '';
    let { description } = match.status;

    if ( // If match is Scheduled
        description === "Scheduled"
        || description === "Post."
      ) {

      matchType = 'matchscheduled';

    } else if ( // If match is over (complete)
      description === "FT"
      || description === "AET"
      || description === "Pen."
      || description === "Awarded"
      || description === "Cancl."){

      matchType = 'matchcomplete'

    } else if ( // If match is in progress
        description === "In Progress"
        || description === "HT"
      ) {
      matchType = 'inprogress'

    }

    this.setState(state => ({
      ...state,
      matchType
    }))
  }

  expandCollapse(value) {
    this.setState(state => ({
      ...state,
      expanded: !value
    }))
  }

  openHighlights = (event, highlightsUrl) => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
  }

  renderTeamPreview() {
    const { match } = this.props;
    const { matchType } = this.state;

    if (matchType === 'matchscheduled') {
      return (
        <div className="crest-container">
          <div className="team-crest">
            <img
              src={match.homeClub.crest}
              alt={match.homeClub.shortName}
            />
          </div>
          <div className="short-name">
            {match.homeClub.shortName}
          </div>
          <div className="vs"></div>
          <div className="team-crest">
            <img
              src={match.visitorClub.crest}
              alt={match.visitorClub.shortName}
            />
          </div>
          <div className="short-name">
            {match.visitorClub.shortName}
          </div>
        </div>
      )
    }
  }

  renderDateTime() {
    const { matchType } = this.state;

    if (matchType === 'matchscheduled') {
      const { match } = this.props;

      var matchDate = '';
      var todaysDate = moment().format('MM/DD/YYYY');
      var tomorrowsDate = moment().add(1, 'days').format('MM/DD/YYYY');

      var localMatchDate = moment.utc(match.matchTime).local();
      if(localMatchDate.format('MM/DD/YYYY') === todaysDate){
        matchDate = 'TODAY ' + localMatchDate.format('h:mma').toUpperCase();
      }
      else if(localMatchDate.format('MM/DD/YYYY') === tomorrowsDate){
        matchDate = 'TOMORROW ' + localMatchDate.format('h:mma').toUpperCase();
      }
      else{
        matchDate = localMatchDate.format('ddd M/D h:mma').toUpperCase();
      }

      return (
        <div className="date-time">
          {matchDate}
        </div>
      )
    }
  }

  renderSeconds = () => {
    if (this.state.matchType === 'inprogress') {
      return (
        <div className="seconds">
          <img src={seconds} alt="" />
        </div>
      )
    }
  }

  renderLiveScore = () => {
    const { matchType } = this.state;

    // If the match is in progress or it is complete,
    // only then return the live score component
    if (
      matchType === 'inprogress'
      || matchType === 'matchcomplete'
      ) {
      const { match } = this.props;

      let { homeClubScore,
            homeClubPenalties,
            visitorClubScore,
            visitorClubPenalties,
            homeClub } = match;

      let ftPens = false;
      let matchStatusDescription = match.status.description;

      if(matchStatusDescription === "Pen.")
      {
        homeClubScore = homeClubScore + ' (' + homeClubPenalties + ')';
        visitorClubScore = visitorClubScore + ' (' + visitorClubPenalties + ')';
        matchStatusDescription = "FT (P)";
        ftPens = true;
      } else if(matchStatusDescription === "In Progress"){
        matchStatusDescription = match.timer + "'";
      }
      else if(matchStatusDescription === "Cancl."){
        matchStatusDescription = "Canceled"
      }
      else if(matchStatusDescription === "Post."){
        matchStatusDescription = "Postponed"
      }

      return (
        <div className="live-score">
          <div className={`score-formatting${ftPens ? ' pens' : ''}`}>
            {homeClubScore}
          </div>
          <div className="team-crest score-formatting">
            <img
              src={homeClub.crest}
              alt={homeClub.shortName}
            />
            <div className="short-name">
              {homeClub.shortName}
            </div>
          </div>

          <div className="score-formatting scoretime">
            <div>
              {matchStatusDescription}
            </div>
            {this.renderSeconds()}
          </div>
          <div className="team-crest score-formatting">
            <img
              src={match.visitorClub.crest}
              alt={match.visitorClub.shortName}
            />
            <div className="short-name">
              {match.visitorClub.shortName}
            </div>
          </div>
          <div className={`score-formatting${ftPens ? ' pens' : ''}`}>
            {visitorClubScore}
          </div>
        </div>
      )
    }
  }

  renderHighlightsButton = () => {
    const { matchType } = this.state;

    // If the match is complete, try to render the highlights button
    if ( matchType === 'matchcomplete' ) {
      const { match } = this.props;

      let highlightsUrl = match.highlightsUrl

      if (highlightsUrl != null) {
        return (
          <div className="match-highlights-link-container">
            <Link
              to={highlightsUrl}
              target="_blank"
              onClick={(event) => this.openHighlights(event, highlightsUrl)}
              className="highlights-link"
            >
              <div className="highlights-link-icon"></div>
              Highlights
            </Link>
          </div>
        )
      } // End if highlightsUrl !=null
    } // End if match is complete
  }

  renderNarrative() {
    const { match } = this.props;

    let narrative = match.preMatchDetails;

    if(match.inMatchDetails){
      narrative = match.inMatchDetails;
    }
    else if(match.postMatchDetails){
      narrative = match.postMatchDetails
    }

    if (this.state.expanded === false) {
      return (
        <div className="narrative">
          {renderHTML(this.truncate(narrative, 50))}
        </div>
      )
    } else {
      return (
        <div className="narrative">
          {renderHTML(narrative)}
        </div>
      )
    }
  }

  truncate(elem, limit) {
    // if not provided, get out of there!
    if (!elem || !limit) return;

    // truncate content based on word limit
    let content = elem.trim();
    content = content.split(" ").slice(0, limit);
    content = content.join(" ") + "...";
    return content;
  }

  render() {
    let { expanded } = this.state;
    let { matchIndex, match } = this.props;

    // Data for MoreInfo component
    let { tvDetails, venue, venueCity } = match;

    if(venue === '' && venueCity !=='' ){
      venue = venueCity;
    }

    let sortedEvents = match.events.sort((a,b) => {
      return a.id - b.id
    }).reverse();

    return (
      <div className="match-container">
        <div
          ref={'match'}
          className={
            `match has-expander${expanded ? ' expander-open' : ' expander-closed'} ${this.state.matchType}`
          }
          onClick={() => this.expandCollapse(expanded)}
        >
          <div className="number-bg">
            <div className="number-place">
              {matchIndex + 1}
            </div>
          </div>
          <div className="content-container">
            <div className="inner-container">
              {this.renderTeamPreview()}
              {this.renderLiveScore()}
              <div className="info-container">
                {this.renderDateTime()}
                {this.renderHighlightsButton()}
                {this.renderNarrative()}
              </div>
            </div>
            <MoreInfo
              events={sortedEvents}
              expandedState={expanded}
              tvDetails={tvDetails}
              venue={venue}
            />
          </div>
        </div>
      </div>
    );
  }
}
