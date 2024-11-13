import React, { Component } from 'react';
import axios from 'axios';
import { Card, Header, Form, Input, Icon } from 'semantic-ui-react';

let endpoint = 'http://localhost:9000';

class ToDoList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      task: '',
      items: [],
      loading: false, // Added loading state
    };
  }

  componentDidMount() {
    this.getTask();
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  onSubmit = () => {
    let { task } = this.state;

    if (task) {
      this.setState({ loading: true }); // Start loading

      axios
        .post(
          endpoint + '/api/tasks',
          { task },
          {
            headers: {
              'Content-Type': 'application/json', // Corrected header
            },
          }
        )
        .then((res) => {
          this.getTask();
          this.setState({
            task: '',
            loading: false, // End loading
          });
          console.log(res);
        })
        .catch((err) => {
          console.error('Error creating task:', err);
          this.setState({ loading: false }); // End loading on error
        });
    }
  };

  getTask = () => {
    this.setState({ loading: true }); // Start loading

    axios
      .get(endpoint + '/api/task')
      .then((res) => {
        if (res.data) {
          this.setState({
            items: res.data.map((item) => {
              let color = 'yellow';
              let style = {
                wordWrap: 'break-word',
              };
              if (item.status) {
                color = 'green';
                style['textDecorationLine'] = 'line-through';
              }
              return (
                <Card key={item._id} color={color} fluid className="rough">
                  <Card.Content>
                    <Card.Header textAlign="left">
                      <div style={style}>{item.task}</div>
                    </Card.Header>
                  {/* </Card.Content> */}

                  <Card.Meta textAlign="right">
                    <Icon
                      name="check circle"
                      color="blue"
                      onClick={() => this.updateTask(item._id, !item.status)} // Toggle task status
                    />
                    <span style={{ paddingRight: 10 }}>Undo</span>
                    <Icon
                      name="delete"
                      color="red"
                      onClick={() => this.deleteTask(item._id)}
                    />
                    <span style={{ paddingRight: 10 }}>Delete</span>
                  </Card.Meta>
                  </Card.Content>
                </Card>
              );
            }),
            loading: false, // End loading
          });
        } else {
          this.setState({
            items: [],
            loading: false, // End loading
          });
        }
      })
      .catch((err) => {
        console.error('Error fetching tasks:', err);
        this.setState({ loading: false }); // End loading on error
      });
  };

  updateTask = (id, status) => {
    axios
      .put(
        endpoint + '/api/tasks/' + id,
        { status },
        {
          headers: {
            'Content-Type': 'application/json', // Corrected header
          },
        }
      )
      .then((res) => {
        console.log(res);
        this.getTask();
      })
      .catch((err) => {
        console.error('Error updating task:', err);
      });
  };

  deleteTask = (id) => {
    axios
      .delete(endpoint + '/api/deleteTask/' + id, {
        headers: {
          'Content-Type': 'application/json', // Corrected header
        },
      })
      .then((res) => {
        console.log(res);
        this.getTask();
      })
      .catch((err) => {
        console.error('Error deleting task:', err);
      });
  };

  render() {
    return (
      <div>
        <div className="row">
          <Header className="header" as="h2" color="yellow">
            To Do List
          </Header>
        </div>
        <div className="row">
          <Form onSubmit={this.onSubmit}>
            <Input
              type="text"
              name="task"
              onChange={this.onChange}
              value={this.state.task}
              fluid
              placeholder="Create Task"
              disabled={this.state.loading} // Disable input when loading
            />
            {/* <Button> Create Task </Button> */}
          </Form>
        </div>
        <div className="row">
          {this.state.loading ? (
            <p>Loading...</p> // Display loading message while fetching data
          ) : (
            <Card.Group>{this.state.items}</Card.Group>
          )}
        </div>
      </div>
    );
  }
}

export default ToDoList;
