/* eslint-disable */
import { EasterEgg } from "components/EasterEgg";
import react, { useEffect, useState } from "react";

export const Score = ({onHandleClick, showEasterEgg, setShowEasterEgg}) => {
	const [score, setScore] = useState(0)
	const [password, setPassword] = useState('')
	const [selectedTeamId, setSelectedTeamId] = useState('');
	const [teamData, setTeamData] = useState([]);

	const apiUrl = process.env.REACT_APP_API_URL

	const fetchTeamData = async () => {
		try {
			const response = await fetch(`/api/v1/teams`);
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const result = await response.json();
			setTeamData(result.data);
		} catch (error) {
			console.error("Fetch error:", error);
		}
	};

	const handleScorePatch = (event) => {
		event.preventDefault();
			fetch(`${apiUrl}/teams/score/${selectedTeamId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type':'application/json',
			},
			body: JSON.stringify({
			"score": score,
			"password": password,
			})
		}).then((response) => {
			fetchTeamData()
			setScore('')
			setPassword('')
		})
	}

	useEffect(() => {
	fetchTeamData()
	setShowEasterEgg(false)
}, [])

	return (
		<div className="score pink-background">
			  < EasterEgg showEasterEgg={showEasterEgg} />
			<div className='score__teams'>
		{teamData.map(data => (
			<div  key={data.id}>
				<h2>{data.name}</h2>
				<span>Poäng: {data.score}</span>
				<h3>Medlemmar</h3>
				{data.players?.map((player, index) => (
					<div key={player.index}>
						<p>{player}</p>
					</div>
				))}
			</div>
		))}
		</div>
			<fieldset>
				<legend>Poäng</legend>
			<form
				action=""
				onSubmit={(e) => handleScorePatch(e, selectedTeamId)}
				className="score-form"
			>
			<label htmlFor="team">Välj Team</label>
			<select
				id="team"
				onChange={(e) => setSelectedTeamId(e.target.value)}
			>
				<option value="" disabled defaultValue>Välj ett team</option>
				{teamData.map((team) => (
					<option key={team.id} value={team.id}>
						{team.name}
					</option>
				))}
			</select>

			<label htmlFor="score">Poäng</label>
			<input
				type="number"
				id="score"
				value={score}
				onChange={(e) => setScore(e.target.value)}
			/>
	
			<label htmlFor="password">Lösenord</label>
			<input
				type="password"
				id="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<input className="btn" type="submit" value="Uppdatera poäng" />
		</form>
		</fieldset>
		<button  className="btn--score" onClick={onHandleClick}></button>
	</div>

	)
}