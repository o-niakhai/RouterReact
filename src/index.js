import * as React from "react";
import { Switch, Route, AppWithRouter, HashRouter } from 'react-router-dom';

const ReactCSSTransitionGroup = ReactTransitionGroup.CSSTransitionGroup;
const {render} = ReactDOM;
const {HashRouter, Link, NavLink, Route, Switch, withRouter} = ReactRouterDOM;

const pageTransitionName = "page";
const repoTransitionName = "repo";
const transitionClassName = "transition-group";
const transitionDuration = 300;
const transitionEnterTimeout = 2 * transitionDuration;

// In this case, we need the call to withRouter.
// Without it, App won't have access to history properties like `location`.
// See https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/withRouter.md
const AppWithRouter = withRouter(App);
render(
  <HashRouter>
    <AppWithRouter>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
        <Route path="/repos" component={Repos}/>
      </Switch>
    </AppWithRouter>
  </HashRouter>,
  document.getElementById('app')
);

function App(props) {
  // Swe have to wrap the Switch component.
  // See https://stackoverflow.com/questions/41981382/react-router-4-beta-2-with-reactcsstransitiongroup
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-heading">
         <Link className="NavLink" to="/">React Router V4 with ReactCSSTransitionGroup</Link>
        </h1>
        <nav>
          <ul className="App-navList">
            <li><NavLink exact className="NavLink" to="/">Home</NavLink></li>
            <li><NavLink className="NavLink" to="/about">About</NavLink></li>
            <li><NavLink className="NavLink" to="/repos">Repos</NavLink></li>
          </ul>
        </nav>
      </header>
      <main className="App-body">
        <ReactCSSTransitionGroup
          component="div"
          className={transitionClassName}
          transitionName={pageTransitionName}
          transitionEnterTimeout={transitionEnterTimeout}
          transitionLeaveTimeout={transitionDuration}>
          {React.cloneElement(props.children, {
            key: getSubstringUntilNth(props.location.pathname, '/', 2),
            location: props.location,
          })}
        </ReactCSSTransitionGroup>
      </main>
    </div>
  );
}

function Home() {
  return (
    <div className="Home">
      <h2 className="Home-heading">Home</h2>
      <p>Welcome to the demo! Try navigating around.</p>
    </div>
  );
}

function About() {
  return (
    <div className="About">
      <h2 className="About-heading">About</h2>
      <p className="About-body">I did this experiment to learn how to add CSS transitions between changes in routes. Look for <code>ReactCSSTransitionGroup</code> in the JS, then see the corresponding CSS.</p>
    </div>
  );
}

function Repos(props) {
  const url = props.match.url;
  return (
    <div className="Repos">
        <nav className="Repos-nav">
          <h2 className="Repos-heading">Repos</h2>
          <ul>
            <li><NavLink className="NavLink" to={`${url}/facebook/react`}>react</NavLink></li>
            <li><NavLink className="NavLink" to={`${url}/reactjs/react-router`}>react-router</NavLink></li>
            <li><NavLink className="NavLink" to={`${url}/reactjs/react-router-tutorial`}>react-router-tutorial</NavLink></li>
          </ul>
        </nav>
        <ReactCSSTransitionGroup
          component="div"
          className={`${transitionClassName} Repos-repoContainer`}
          transitionName={repoTransitionName}
          transitionEnterTimeout={transitionEnterTimeout}
          transitionLeaveTimeout={transitionDuration}
        >
          <Route
            key={props.location.pathname}
            location={props.location}
            path={`${url}/:userName/:repoName`}
            component={Repo}/>
        </ReactCSSTransitionGroup>
    </div>
  );
}

function Repo(props) {
  const {userName, repoName} = props.match.params;
  return (
    <div className="Repo">
      <h3 className="Repo-heading">{repoName}</h3>
      <div className="Repo-body">
        <p>
          <a href={`https://github.com/${userName}/${repoName}`}>More information</a> about this repo.
        </p>
      </div>
    </div>
  );
}

function getSubstringUntilNth(str, pattern, n) {
  return  str.split(pattern, n).join(pattern);
}
