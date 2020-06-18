var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FilterDisplay = function FilterDisplay(props) {
  return React.createElement(
    "div",
    { className: "chkbox d-flex justify-content-center my-2" },
    React.createElement(
      "label",
      { className: "px-2" },
      React.createElement("input", { type: "checkbox", name: "all", checked: props.filter === "all", onChange: props.taskToggle }),
      "All"
    ),
    React.createElement(
      "label",
      { className: "px-2" },
      React.createElement("input", { type: "checkbox", name: "completed", checked: props.filter === "completed", onChange: props.taskToggle }),
      "Completed"
    ),
    React.createElement(
      "label",
      { className: "px-2" },
      React.createElement("input", { type: "checkbox", name: "active", checked: props.filter === "active", onChange: props.taskToggle }),
      "Active"
    )
  );
};

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this.state = {
      tasks: [{
        id: 1,
        content: 'A to do list task',
        completed: 'false'
      }],
      newTask: "",
      filter: "all"
    };
    _this.getTask = _this.getTask.bind(_this);
    _this.taskInput = _this.taskInput.bind(_this);
    _this.addTask = _this.addTask.bind(_this);
    _this.removeTask = _this.removeTask.bind(_this);
    _this.updateTask = _this.updateTask.bind(_this);
    _this.taskToggle = _this.taskToggle.bind(_this);
    return _this;
  }

  _createClass(App, [{
    key: "getTask",
    value: function getTask() {
      var _this2 = this;

      fetch("https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=166").then(function (response) {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Something is wrong here');
      }).then(function (data) {
        var tasks = data.tasks;
        _this2.setState({
          tasks: tasks
        });
      });
    }
  }, {
    key: "taskInput",
    value: function taskInput(event) {
      var input = event.target.value;
      this.setState({
        newTask: input
      });
    }
  }, {
    key: "addTask",
    value: function addTask(event) {
      var _this3 = this;

      var copyState = this.state.tasks.slice();
      event.preventDefault();
      var data = this.state.newTask;
      var postData = {
        task: {
          content: data
        }
      };
      fetch("https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=166", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(postData)
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        copyState.push(data.task);
        _this3.setState({
          tasks: copyState,
          newTask: ""
        });
      });
    }
  }, {
    key: "updateTask",
    value: function updateTask(event) {
      var _this4 = this;

      var targetId = event.target.parentNode.id;
      var completed = event.target.checked; // if checked => true, else => false
      var apiKeyWord = completed === true ? "complete" : "active";
      fetch("https://altcademy-to-do-list-api.herokuapp.com/tasks/" + targetId + "/mark_" + apiKeyWord + "?api_key=166", {
        method: "PUT"
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        _this4.getTask();
      });
    }
  }, {
    key: "removeTask",
    value: function removeTask(event) {
      var _this5 = this;

      event.preventDefault();
      var newState = [];
      var targetId = event.target.parentNode.id;
      fetch("https://altcademy-to-do-list-api.herokuapp.com//tasks/" + targetId + "?api_key=166", {
        method: "DELETE"
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        _this5.getTask();
      });
    }
  }, {
    key: "taskToggle",
    value: function taskToggle(event) {
      var status = event.target.name;
      this.setState({
        filter: status
      });
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      this.getTask();
    }
  }, {
    key: "render",
    value: function render() {
      var _this6 = this;

      var stateCopy = this.state.tasks.slice().sort(function (first, second) {
        return first.id > second.id;
      });
      console.log(stateCopy);
      var showTask = stateCopy.filter(function (eachTask) {
        if (_this6.state.filter === "all") {
          return true;
        } else if (_this6.state.filter === "active") {
          return !eachTask.completed;
        } else {
          return eachTask.completed;
        }
      }).map(function (eachTask) {
        return React.createElement(
          "div",
          { key: eachTask.id, id: eachTask.id, className: "task-content d-flex justify-content-end py-1 my-2 rounded" },
          React.createElement(
            "div",
            { className: "d-flex align-items-center" },
            React.createElement(
              "span",
              { className: "mx-2" },
              eachTask.content
            )
          ),
          React.createElement("input", { className: "mx-2", type: "checkbox", onChange: _this6.updateTask, checked: eachTask.completed === true }),
          React.createElement(
            "button",
            { className: "btn btn-outline-info mx-2", onClick: _this6.removeTask },
            "remove"
          )
        );
      });
      return React.createElement(
        "div",
        { className: "container-fluid" },
        React.createElement(
          "div",
          { className: "row" },
          React.createElement(
            "div",
            { className: "col-12 d-flex justify-content-center my-2" },
            React.createElement(
              "h2",
              null,
              "Todo List for Today"
            )
          ),
          React.createElement(
            "div",
            { className: "col-12 d-flex flex-column justify-content-center" },
            React.createElement(
              React.Fragment,
              null,
              React.createElement(FilterDisplay, { filter: this.state.filter, taskToggle: this.taskToggle }),
              React.createElement(
                "div",
                { className: "d-flex flex-column justify-content-center align-items-center my-2" },
                showTask
              ),
              React.createElement(
                "div",
                { className: "d-flex justify-content-center align-items-center my-2" },
                React.createElement(
                  "div",
                  { className: "new-task d-flex justify-content-end" },
                  React.createElement(
                    "div",
                    { className: "input-group input-group-lg d-flex align-items-center" },
                    React.createElement("input", { className: "input-area form-control input-lg my-2 mx-2", type: "text", value: this.state.newTask, onChange: this.taskInput })
                  ),
                  React.createElement(
                    "button",
                    { className: "btn btn-info my-2", onClick: this.addTask },
                    "add"
                  )
                )
              )
            )
          )
        )
      );
    }
  }]);

  return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById("root"));