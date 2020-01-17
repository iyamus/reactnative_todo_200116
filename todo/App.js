import React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Dimensions, Platform, ScrollView } from 'react-native';
import ToDo from "./ToDo";


const { height, width } = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newTodo: ""
  };

  render() {
    const { newTodo } = this.state;

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
          />
          <ScrollView contentContainerStyle={styles.todo}>
            <ToDo text={"Hi"}/>

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
  todo:{
    alignItems:"center"
  }
});
