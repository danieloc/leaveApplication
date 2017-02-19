/**
 * Created by Daniel on 1/7/2017.
 */
import React from 'react';
import { connect } from 'react-redux'
import NavBar from './NavBar'
import AddNodesForm from './AddNodesForm';
import SingleGoal from './SingleGoal';
import { getDeleteNodeModal, setParent} from '../actions/modals';

class Nodes extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if(this.props.user.nodes.length > 0) {
            this.props.dispatch(setParent(this.props.user.nodes[0], [0]));
        }
    }
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    displayToDos() {
        if (this.props.user.nodes.length > 0 && this.props.user.nodes[this.props.parentIndex] != null) {
            if (!this.props.childID) {
                if (this.props.user.nodes[this.props.parentIndex].todos.length > 0) {
                    return this.props.user.nodes[this.props.parentIndex].todos.map((todo, i) => {
                        return <SingleGoal key={i} index={i} obj={todo} parentID={this.props.parentID}
                                           childID={this.props.childID} handleChange={this.handleChange}> </SingleGoal>;
                    });
                }
            }
            else if(this.props.user.nodes[this.props.parentIndex].subnodes[this.props.childIndex]) {
                if (this.props.user.nodes[this.props.parentIndex].subnodes[this.props.childIndex].todos.length > 0) {
                    return this.props.user.nodes[this.props.parentIndex].subnodes[this.props.childIndex].todos.map((todo, i) => {
                        return <SingleGoal key={i} index={i} obj={todo} parentID={this.props.parentID}
                                           childID={this.props.childID} handleChange={this.handleChange}> </SingleGoal>;
                    });
                }
            }
        }else {
            return [];
        }
    }

    getNavBars(nodes, depth) {
        var lowerNavBars = <div></div>;
        if(nodes && nodes[this.props.indexList[0]] && this.props.indexList.length >= depth) {
            lowerNavBars = this.getNavBars(nodes[this.props.indexList[0]].subnodes, depth + 1)
        }
        return <div><NavBar nodes = {nodes} depth = {depth}/> {lowerNavBars} </div>
    }
    render() {

        const message = this.props.childID ? "SUB LEVEL NODE: " : "TOP LEVEL NODE: ";

        const addNodesForm = this.props.user.nodes[this.props.parentIndex] ? <AddNodesForm parentNode_ID = {this.props.parentID} childNode_ID = {this.props.childID} name = {message + this.getNodeName()}/> :
            null;
        const deleteNodeButton = this.props.user.nodes.length > 0 ? <button className="btn-danger" onClick={() => {this.props.dispatch(getDeleteNodeModal(this.props.node.name))}}> Delete Node</button> :
            null;

        return (
            <div>
                {this.getNavBars(this.props.user.nodes, 1)}
                <div className="panel-body">
                    {deleteNodeButton}
                    {addNodesForm}
                    {this.displayToDos()}
                </div>
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        activeModal: state.modals.activeModal,
        node : state.modals.node,
        indexList : state.modals.indexList,
        depth : state.modals.depth

    };
};

export default connect(mapStateToProps)(Nodes);
