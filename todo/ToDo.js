import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, StatusBar, TextInput, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get("window");

export default class ToDo extends React.Component {

    state = {
        isEditing: false,
        isCompleted: false
    };
    render() {
        const { isCompleted } = this.state;

        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={this._completeTodo}>
                    <View style={[styles.circle,
                    isCompleted ?
                        styles.comletedCircle :
                        styles.uncompletedCircle
                    ]}></View>
                </TouchableOpacity>
                <Text style={styles.text}>Hello</Text>
            </View>);
    }

    _completeTodo = () => {
        this.setState(preState => {
            return {
                isCompleted: !preState.isCompleted
            };
        })
    }
}

const styles = StyleSheet.create({
    container: {
        width: width - 50,
        borderBottomColor: "#bbb",
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: "row",
        alignItems: "center",
        // padding: 10
    },
    text: {
        fontWeight: "600",
        fontSize: 20,
        marginVertical: 20,
        fontFamily: 'sans-serif-light'
    },
    circle: {
        width: 30,
        height: 30,
        borderRadius: 25,
        borderWidth: 3,
        marginRight: 20
    },
    comletedCircle: {
        borderColor: "#F23657"
    },
    uncompletedCircle: {
        borderColor: "gray"
    }
})