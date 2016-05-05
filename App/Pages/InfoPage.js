'use strict';

var React = require('react-native');
var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
} = React;

var Icon = require('react-native-vector-icons/FontAwesome');
var UserWidget = require('../UserWidget');

import Store from 'react-native-store';
const DB = {
    'theme': Store.model('theme')
}

var themes = require('../Themes/main');

var InfoPage = React.createClass({

    getInitialState: function() {
        return {
            post: this.props.post
        };
    },

    componentDidMount: function() {
        DB.theme.find().then( (resp) => {
            var theme = themes[resp[0].theme ? resp[0].theme : 'light'];
            this.setState({theme: theme});
        });
    },

    renderVotes: function() {
        if(this.state.post.votes.length){
            return (<View></View>);
        }

        var limit = 6;
        if(this.state.post.votes.length < 6)
            limit = this.state.post.votes.length;

        var rows = [];
        for(var i=0; i<limit; i++) {
            rows.push(<Image key={i} source={{uri: this.state.post.votes[i].user.image_url['50px'] }} style={styles.thumbnail} />)
        }
        rows.push(<Icon key={6} style={{marginLeft:15, marginTop: 10}} name="ellipsis-h" size={30} color="#000000" />);
        return rows;
    },

    _viewProfile: function(user) {
        this.props.navigator.push({
            index: 4,
            passProps: {user: user}
        });
    },

    _translateCategory: function(id) {
        switch (id) {
            case 1: return 'Tech'; break;
            case 2: return 'Games'; break;
            case 3: return 'Podcasts'; break;
            case 4: return 'Books'; break;
            default: return 'Tech';
        }
    },

    render: function() {
        return (
            <ScrollView
            style={styles.container}>

            <Text style={this.headStyle()}>MAKERS</Text>
            <View style={styles.users}>
            {this.state.post.makers.map( (maker, i) =>
                <TouchableOpacity key={i} onPress={() => this._viewProfile(maker)}>
                <Image key={i} source={{uri: maker.image_url['50px'] }} style={styles.thumbnail} />
                </TouchableOpacity>
             ) }
            </View>

            <Text style={this.headStyle()}>UPVOTES</Text>
            <View style={styles.users}>
            {this.renderVotes()}
            </View>

            <Text style={this.headStyle()}>PLATFORMS</Text>
            <View style={styles.users}>
            {this.state.post.platforms.map( (platform, i) => <Text key={i} style={styles.tag}>{platform.name}</Text> ) }
            </View>

            <Text style={this.headStyle()}>CATEGORY</Text>
            <Text style={this.tagStyle()}>{this._translateCategory(this.state.post.category_id)}</Text>

            <Text style={this.headStyle()}>HUNTED BY</Text>
            <UserWidget user={this.state.post.user} navigator={this.props.navigator} />

            </ScrollView>
        );
    },

    headStyle: function() {
        if(this.state.theme){
            return {
                fontWeight: 'bold',
                marginTop: 15,
                marginBottom: 5,
                marginLeft: 10,
                color: this.state.theme.foreground
            }
        } else return {
            fontWeight: 'bold',
            marginTop: 15,
            marginBottom: 5,
            marginLeft: 10,
            color: '#000000'
        }
    },

    tagStyle: function() {
        if(this.state.theme){
            return {
                marginTop: 5,
                marginBottom: 5,
                marginLeft: 10,
                color: this.state.theme.foreground
            }
        } else return {
            marginTop: 5,
            marginBottom: 5,
            marginLeft: 10,
            color: '#3e3e3e'
        }
    },

});

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    thumbnail: {
        height: 50,
        width: 50,
        borderRadius: 50,
        marginLeft: 5
    },
    users: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 5
    }
});

module.exports = InfoPage;
