import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, StatusBar, TextInput, Dimensions, Platform, TouchableNativeFeedbackBase } from 'react-native';

const { width, height } = Dimensions.get("window");

export default class ToDo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            toDoValue: props.text
        }
    }

    render() {
        // console.log("Todo.js ",this.props); 포기하지 말고 하나씩 확인해보자.
        const { isEditing, toDoValue } = this.state;
        const { text, id, deleteTodo, isCompleted } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.column}>
                    <TouchableOpacity onPress={this._completeTodo}>
                        <View style={[styles.circle,
                        isCompleted ?
                            styles.comletedCircle :
                            styles.uncompletedCircle
                        ]} />
                    </TouchableOpacity>
                    {isEditing ?
                        (<TextInput style={[
                            styles.text,
                            styles.input,
                            isCompleted ?
                                styles.comletedText : styles.uncompletedText]}
                            value={toDoValue} multiline={true}
                            onChangeText={this._controlInput}
                            // 외부영역 클릭시 자동으로 입력되도록 함.
                            onBlur={this._finishEditing}
                            underlineColorAndroid={"transparent"}
                        />
                        ) : (
                            <Text style={
                                [
                                    styles.text,
                                    isCompleted ?
                                        styles.comletedText :
                                        styles.uncompletedText
                                ]
                            }>
                                {text}
                            </Text>
                        )}
                </View>
                {isEditing ?
                    (
                        <View style={styles.actions}>
                            <TouchableOpacity onPress={this._finishEditing}>
                                <View style={styles.actionContainer}>
                                    <Text style={styles.actionText}>✔️</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.actions}>
                            <TouchableOpacity onPress={this._startEditing}>
                                <View style={styles.actionContainer}>
                                    <Text style={styles.actionText}>✏️</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPressOut={event => {
                                // console.log("touch",id); 포기하지 말고 하나씩 확인해보자.

                                //상위 컴포넌트인 SctrollView에 영향을 주지 않도록 설정
                                event.stopPropagation;
                                deleteTodo(id)
                            }}>
                                <View style={styles.actionContainer}>
                                    <Text style={styles.actionText}>❌</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
            </View>);
    }

    _completeTodo = (event) => {
        //상위 컴포넌트인 SctrollView에 영향을 주지 않도록 설정
        event.stopPropagation();
        const { isCompleted, uncomplatedTodo, complatedTodo, id, updatedTodo } = this.props;
        if (isCompleted) {
            uncomplatedTodo(id);
        } else {
            complatedTodo(id);
        }
    }
    _startEditing = (event) => {
        //상위 컴포넌트인 SctrollView에 영향을 주지 않도록 설정
        event.stopPropagation();
        this.setState(preState => {
            return {
                isEditing: true
            };
        })

    }
    _finishEditing = (event) => {
        //상위 컴포넌트인 SctrollView에 영향을 주지 않도록 설정
        event.stopPropagation();
        const { toDoValue } = this.state;
        const { id, updatedTodo } = this.props;
        updatedTodo(id, toDoValue);
        this.setState({ isEditing: false })
    }
    _controlInput = (text) => {
        this.setState({
            toDoValue: text
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
        //container를 속성에 따라 분리시킴.
        justifyContent: "space-between"

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
        borderColor: "gray"
    },
    uncompletedCircle: {
        borderColor: "#F23657"
    },
    comletedText: {
        color: "#bbb",
        //취소선 생성
        textDecorationLine: "line-through"
    },
    uncomletedText: {
        color: "#353839",
    },
    column: {
        flexDirection: "row",
        alignItems: "center",
        width: width / 2
    },
    actions: {
        flexDirection: "row"
    },
    actionContainer: {
        marginVertical: 10,
        marginHorizontal: 10
    },
    actionText: {},
    input: {
        width: width / 2,
        marginVertical: 15,
        paddingBottom: 5
    },
    mark: {
        alignContent: "flex-end"
    }
})