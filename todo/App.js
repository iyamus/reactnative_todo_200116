import React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Dimensions, Platform, ScrollView, AsyncStorage } from 'react-native';
import ToDo from "./ToDo";
import { AppLoading } from "expo";
import uuidv1 from "uuid/v1";


const { height, width } = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newToDo: "",
    loadedToDos: false,
    todo: {}
  };

  componentDidMount = () => {
    this._loadToDos();
  }
  render() {
    const { newTodo, loadedToDos, todo } = this.state;

    console.log('chcek', todo);

    if (!loadedToDos) {
      return <AppLoading />
    }

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>Simple To Do</Text>
        <View style={styles.card}>
          <TextInput style={styles.input}
            value={newTodo}
            onChangeText={this._controlNewToDo}

            //세부 설정
            placeholder={"New to do."}
            placeholderTextColor={"#999"}
            autoCorrect={false}
            onSubmitEditing={this._addToDo}

          />
          <ScrollView contentContainerStyle={styles.todo}>
            <ToDo text={"Hi"} />

          </ScrollView>
        </View>
      </View>
    );
  }

  _controlNewToDo = text => {
    this.setState({
      newTodo: text
    })
  }
  _loadToDos = () => {
    this.setState({
      loadedToDos: true
    });
  }
  _addToDo = () => {
    const { newTodo } = this.state;
    if (newTodo !== "") {
      this.setState(prevState => {
        //고유 ID 생성을 위해 uuid 사용
        const ID = uuidv1();

        const newToDoObj = {
          [ID]: {
            id: ID,
            isCompleted: false,
            text: newTodo,
            createdAt: Date.now()
          }
        };
        const newState = {
          //이전의 state 정보를 가져오고
          ...prevState,
          //newTodo에 입력된 정보를 없애고
          newTodo: "",
          //이전의 todo와 신규 todoObj를 하나로 묶는다.
          todo: {
            ...prevState.todo,
            ...newToDoObj
          }
        };
        return { ...newState };
      });
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F23657',
    alignItems: 'center'
  },
  title: {
    color: "white",
    fontSize: 30,
    marginTop: 50,
    fontWeight: "300",
    marginBottom: 30,
    fontFamily: 'serif'
  },
  card: {
    backgroundColor: "white",
    flex: 1,
    width: width - 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

    //플랫폼에 따라 속성이 달라지는 경우 platform 사용해 별도로 적용.
    ...Platform.select({
      ios: {
        shadowColor: "rgb(50,50,50)",
        shadowOpacity: 0.5,
        shadowRadius: 10,
        shawdowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 3
      }
    })
  },
  input: {
    padding: 20,
    borderBottomColor: "#bbb",
    borderBottomWidth: StyleSheet.hairlineWidth,
    fontSize: 25,
    fontFamily: 'sans-serif-light'
  },
  todo: {
    alignItems: "center"
  }
});
