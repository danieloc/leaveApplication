/**
 * Created by Daniel on 12/30/2016.
 */
import React from "react";
import { connect } from "react-redux";
import { getWalkThrough } from "../actions/modals";
import { getInvitationModal } from "../actions/modals";
import { toggleSideBar } from "../actions/viewPortActions";
import _ from "lodash";
import Nodes from "./Nodes";

export default class Home extends React.Component {
  render() {
    return <h1>Hello World</h1>;
  }
}
