import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Header, Form, Input, Icon } from 'semantic-ui-react';

let endpoint = 'http://localhost:9000';

function ToDoList() {
  const [task, setTask] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTask();
  }, []);

  const onChange = (event) => {
    setTask(event.target.value);
  };

  const onSubmit = () => {
    if (task) {
      setLoading(true);
      axios
        .post(endpoint + '/api/tasks', { task }, {
            //content-typeでjson形式でサーバーにデータ尾を送るというのを伝えている
          headers: { 'Content-Type': 'application/json' }
        })
        .then(() => {
          getTask();
          setTask('');
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error creating task:', err);
          setLoading(false);
        });
    }
  };
//todo shihota ここから復習
  const getTask = () => {
    setLoading(true);
    axios
      .get(endpoint + '/api/task')
      .then((res) => {
        if (res.data) {
          setItems(
            res.data.map((item) => ({
              ...item,
              color: item.status ? 'green' : 'yellow',
              style: {
                wordWrap: 'break-word',
                textDecorationLine: item.status ? 'line-through' : 'none',
              },
            }))
          );
        } else {
          setItems([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching tasks:', err);
        setLoading(false);
      });
  };

  const updateTask = (id, status) => {
    axios
      .put(endpoint + '/api/tasks/' + id, { status }, {
        headers: { 'Content-Type': 'application/json' }
      })
      .then(() => getTask())
      .catch((err) => console.error('Error updating task:', err));
  };

  const deleteTask = (id) => {
    axios
      .delete(endpoint + '/api/deleteTask/' + id, {
        headers: { 'Content-Type': 'application/json' }
      })
      .then(() => getTask())
      .catch((err) => console.error('Error deleting task:', err));
  };

  return (
    <div>
      <div className="row">
        <Header className="header" as="h2" color="yellow">
          To Do List
        </Header>
      </div>
      <div className="row">
        <Form onSubmit={onSubmit}>
          <Input
            type="text"
            name="task"
            onChange={onChange}
            value={task}
            fluid
            placeholder="Create Task"
            disabled={loading}
          />
        </Form>
      </div>
      <div className="row">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Card.Group>
            {items.map((item) => (
              <Card key={item._id} color={item.color} fluid>
                <Card.Content>
                  <Card.Header textAlign="left">
                    <div style={item.style}>{item.task}</div>
                  </Card.Header>
                  <Card.Meta textAlign="right">
                    <Icon
                      name="check circle"
                      color="blue"
                      onClick={() => updateTask(item._id, !item.status)}
                    />
                    <span style={{ paddingRight: 10 }}>Undo</span>
                    <Icon
                      name="delete"
                      color="red"
                      onClick={() => deleteTask(item._id)}
                    />
                    <span style={{ paddingRight: 10 }}>Delete</span>
                  </Card.Meta>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        )}
      </div>
    </div>
  );
}

export default ToDoList;
