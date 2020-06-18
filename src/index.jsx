const FilterDisplay = (props) =>{
  return(
    <div className="chkbox d-flex justify-content-center my-2">
        <label className="px-2"><input type="checkbox" name="all" checked={props.filter === "all"} onChange={props.taskToggle}/>
          All</label>
        <label className="px-2"><input type="checkbox" name="completed" checked={props.filter === "completed"} onChange={props.taskToggle}/>
          Completed</label>
        <label className="px-2"><input type="checkbox" name="active" checked={props.filter === "active"} onChange={props.taskToggle}/>
          Active</label>
    </div>
  )
}

class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      tasks:[{
        id: 1,
        content: 'A to do list task',
        completed: 'false',
      }],
      newTask: "",
      filter: "all"
    }
    this.getTask = this.getTask.bind(this)
    this.taskInput = this.taskInput.bind(this)
    this.addTask = this.addTask.bind(this)
    this.removeTask = this.removeTask.bind(this)
    this.updateTask = this.updateTask.bind(this)
    this.taskToggle = this.taskToggle.bind(this)
  }

  getTask () {
    fetch(`https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=166`)
    .then((response) => {
      if(response.ok){
        return response.json()
      }
       throw new Error('Something is wrong here');
    })
    .then((data) => {
      const tasks = data.tasks
      this.setState({
        tasks: tasks
      })
    })
  }

  taskInput (event) {
    const input = event.target.value;
    this.setState({
      newTask: input
    })
  }

  addTask(event) {
    const copyState = this.state.tasks.slice();
    event.preventDefault();
    const data = this.state.newTask
    const postData = {
      task: {
        content: data,
      }
    }
    fetch("https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=166", {
       method: "POST",
       headers: {
           "Content-Type": "application/json; charset=utf-8",
       },
       body: JSON.stringify(postData),
     })
     .then((response) => response.json())
     .then((data) => {
       copyState.push(data.task)
       this.setState({
         tasks: copyState,
         newTask: ""
       })
     })
   }

  updateTask(event){
    const targetId = event.target.parentNode.id;
    const completed = event.target.checked // if checked => true, else => false
    const apiKeyWord = completed === true ? "complete": "active"
    fetch(`https://altcademy-to-do-list-api.herokuapp.com/tasks/${targetId}/mark_${apiKeyWord}?api_key=166`, {
       method: "PUT",
     })
     .then((response) => response.json())
     .then((data) =>{
       this.getTask()
     })
  }

  removeTask(event){
    event.preventDefault()
    const newState = [];
    const targetId = event.target.parentNode.id;
    fetch(`https://altcademy-to-do-list-api.herokuapp.com//tasks/${targetId}?api_key=166`, {
       method: "DELETE",
     })
     .then((response) => response.json())
     .then((data) =>{
       this.getTask()
     }
     )
  }

  taskToggle(event){
    const status = event.target.name;
    this.setState({
      filter: status
    })
  }

  componentWillMount(){
    this.getTask()
  }

  render(){
    const stateCopy = this.state.tasks.slice().sort(function(first, second){
      return first.id > second.id;
    })
    console.log(stateCopy);
    const showTask = stateCopy.filter(eachTask => {
      if(this.state.filter === "all"){
        return true
      }
      else if (this.state.filter === "active"){
        return !eachTask.completed
      }
      else {
        return eachTask.completed
      }
    }).map(eachTask => {
      return (
          <div key={eachTask.id} id={eachTask.id} className="task-content d-flex justify-content-end py-1 my-2 rounded">
            <div className="d-flex align-items-center"><span className="mx-2">{eachTask.content}</span></div>
            <input className="mx-2" type="checkbox" onChange={this.updateTask} checked={eachTask.completed === true}/>
            <button className="btn btn-outline-info mx-2"onClick={this.removeTask}>remove</button>
          </div>
      )}
    )
    return(
      <div className="container-fluid">
      <div className="row">
        <div className="col-12 d-flex justify-content-center my-2">
          <h2>Todo List for Today</h2>
        </div>
        <div className="col-12 d-flex flex-column justify-content-center">
          <React.Fragment>
            <FilterDisplay filter={this.state.filter} taskToggle={this.taskToggle}/>
            <div className="d-flex flex-column justify-content-center align-items-center my-2">{showTask}</div>
            <div className="d-flex justify-content-center align-items-center my-2">
              <div className="new-task d-flex justify-content-end">
                <div className="input-group input-group-lg d-flex align-items-center">
                  <input className="input-area form-control input-lg my-2 mx-2" type="text" value={this.state.newTask} onChange={this.taskInput}/>
                </div>
                <button className="btn btn-info my-2" onClick={this.addTask}>add</button>
              </div>
            </div>
          </React.Fragment>
        </div>
      </div>
    </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById("root")
)
