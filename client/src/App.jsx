/* eslint-disable no-unused-vars */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import './App.css';
import './container/HomePage';
import AppBar from './layout/AppBar';
import Login from './container/Login';
import Register from './container/Register';
import CoursesList from './container/CoursesList';
import Course from './container/Course';
import HomePage from './container/HomePage';

function App() {
	return (
		<>
			<div className="App">
				<RecoilRoot>
					<Router>
						<AppBar />
						<Routes>
							<Route path={'/'} element={<HomePage />} />
							<Route path={'/login'} element={<Login />} />
							<Route path={'/register'} element={<Register />} />
							<Route
								path={'/courses'}
								element={<CoursesList />}
							/>
							<Route
								path={'/course/:courseId'}
								element={<Course />}
							/>
						</Routes>
					</Router>
				</RecoilRoot>
			</div>
		</>
	);
}

export default App;
