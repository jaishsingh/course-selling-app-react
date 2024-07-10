/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, TextField, Button } from '@mui/material';
import { CourseCard } from '../../components/CourseCard';

function Course() {
	const { courseId } = useParams();
	const [course, setCourse] = React.useState(null);

	React.useEffect(() => {
		fetch(
			`${
				import.meta.env.VITE_BACKEND_API
			}/api/v1/admin/course/${courseId}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			}
		)
			.then((response) => response.json())
			.then((data) => {
				setCourse(data.course);
			});
	}, []);

	if (course) {
		return (
			<div
				style={{
					display: 'flex',
					flexFlow: 'column nowrap',
					gap: '4rem',
					padding: '4rem 8rem',
				}}
			>
				<CourseCard course={course} />
				<CourseUpdateCard course={course} setCourse={setCourse} />
			</div>
		);
	}

	return <div>Loading ...</div>;
}

function CourseUpdateCard(props) {
	var updatedCourse = {};
	const oldCourse = props.course;
	console.log(`oldCourse: ${JSON.stringify(oldCourse)}`);

	return (
		<div
			style={{
				height: 'auto',
				padding: '1rem',
				border: '1px solid #ddd',
				borderRadius: '.5rem',
				boxShadow: '0 0 10px #ddd',
				backgroundColor: '#f5f5f5',
				display: 'flex',
				flexFlow: 'column nowrap',
				gap: '1.5rem',
			}}
		>
			<Typography variant="h5">Update Course :</Typography>
			<TextField
				label="Title"
				onChange={(e) => {
					updatedCourse = {
						...updatedCourse,
						title: e.target.value,
					};
				}}
			/>
			<TextField
				label="Description"
				onChange={(e) => {
					updatedCourse = {
						...updatedCourse,
						description: e.target.value,
					};
				}}
			/>
			<TextField
				label="Price"
				onChange={(e) => {
					updatedCourse = {
						...updatedCourse,
						price: e.target.value,
					};
				}}
			/>
			<TextField
				label="Thumbnail URL"
				onChange={(e) => {
					updatedCourse = {
						...updatedCourse,
						thumbnailUrl: e.target.value,
					};
				}}
			/>
			<Button
				type="submit"
				variant="contained"
				size="small"
				onClick={async (e) => {
					updatedCourse = {
						...updatedCourse,
						published: oldCourse.published,
					};
					// console.log(JSON.stringify(updatedCourse));
					const response = await fetch(
						`${
							import.meta.env.VITE_BACKEND_API
						}/api/v1/admin/course/${oldCourse._id}`,
						{
							method: 'PUT',
							headers: {
								'Content-Type': 'application/json',
								Authorization: `Bearer ${localStorage.getItem(
									'token'
								)}`,
							},
							body: JSON.stringify(updatedCourse),
						}
					);
					if (response.status === 200) {
						alert('Course updated successfully');
						const updatedCourseReceived = (await response.json())
							.updatedCourse;
						props.setCourse({
							...oldCourse,
							...updatedCourseReceived,
						});
					}
				}}
			>
				Update
			</Button>
		</div>
	);
}

export default Course;
