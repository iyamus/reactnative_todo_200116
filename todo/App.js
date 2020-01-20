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
            {Object.values(todo)
              .reverse() //최신항목이 먼저보이도록 설정.
              .map(todo =>
                <ToDo
                  key={todo.id}
                  deleteTodo={this._deleteTodo}
                  uncomplatedTodo={this._uncomplatedTodo}
                  complatedTodo={this._complatedTodo}
                  updatedTodo={this._updatedTodo}
                  {...todo}>
                </ToDo>)}

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

  //storage에서 정보를 가져오기 async ~ wait
  _loadToDos = async () => {
    try {
      //string으로 저장된 정보를 가져옴. 
      const todo = await AsyncStorage.getItem("todos");
      //string을 Json 형태로 변환함
      const parsedTodo = JSON.parse(todo);

      // 시간 지연을 통해서 splash화면 보여줌.
      setTimeout(() => this.setState({
        loadedToDos: true,
        todo: parsedTodo || {}
      }), 2000);
    } catch (error) {
      console.log(error);
    }
    //정보를 AsyncStore에서 읽어 온 이후에 기존 정보를 날려버림.
    AsyncStorage.clear();
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
        this._saveTodo(newState.todo);
        return { ...newState };
      });
    }
  }

  _deleteTodo = (id) => {
    this.setState(prevState => {
      const todo = prevState.todo;
      delete todo[id];
      const newState = {
        ...prevState,
        ...todo
      };
      this._saveTodo(newState.todo);
      return { ...newState };
    });
  };

  _uncomplatedTodo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        todo: {
          ...prevState.todo,
          [id]: {
            ...prevState.todo[id],
            isCompleted: false
          }
        }
      };
      this._saveTodo(newState.todo);
      return { ...newState };
    });
  };
  _complatedTodo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        todo: {
          ...prevState.todo,
          [id]: {
            ...prevState.todo[id],
            isCompleted: true
          }
        }
      };
      this._saveTodo(newState.todo);
      return { ...newState };
    });
  };
  _updatedTodo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        todo: {
          ...prevState.todo,
          [id]: {
            ...prevState.todo[id],
            text: text
          }
        }
      };
      this._saveTodo(newState.todo);
      return { ...newState };
    });
  };

  //
  _saveTodo = (newTodo) => {
    //AsyncStorage는 object가 아닌, string타입으로 저장한다.
    // 그래서 변환을 위해 stringify로 변환한다.
    console.log("Json1", JSON.stringify(newTodo));
    const saveTodo = AsyncStorage.setItem("todos", JSON.stringify(newTodo));
    console.log("Json2", saveTodo);

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
