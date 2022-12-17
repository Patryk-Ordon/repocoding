import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../API";
import "../../components/common/sass/auth.scss";
import logo from "../../resources/logo.png";

type Props = {
	isLoggedIn: boolean;
};

const Register: React.FC<Props> = ({ isLoggedIn }) => {
	const [password, setPassword] = useState("");
	const [mail, setMail] = useState("");
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const [info, setInfo] = useState<JSX.Element[]>();

	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		if (!mail || !password) {
			setInfo([<>Uzupełnij dane</>]);
			setLoading(false);
			return;
		}

		setInfo([<></>]);

		const data = await API.signUpFetch(name, mail, password);

		console.log(data);

		if (data.ok) {
			setLoading(false);
			setInfo([<>Zarejestrowano</>]);
			navigate("/sign-in");
		} else {
			console.log(data.errors);
			if (data.errors.length) {
				console.log("test");
				let messages: JSX.Element[] = [];
				data.errors.forEach((el: any) => {
					messages.push(el.msg);
				});

				console.log(messages);
				setInfo(messages);
			}
			setLoading(false);
		}
	};

	useEffect(() => {
		if (isLoggedIn) navigate("/dashboard");
	}, []);

	return (
		<div className="container">
			<div className="register">
				<img src={logo} alt="logo" className="logo" />
				<form method="POST" onSubmit={handleSubmit}>
					<span className="welcome">
						Witaj! Z tej strony <i>Mesafe</i> - jestem bezpiecznym kominukatorem
						stosującym szyfrowanie E2E. Zarejestruj się, abyśmy mogli rozmawiać
						dalej
					</span>
					<p>
						<input
							onChange={(e) => setName(e.target.value)}
							value={name}
							type="text"
							name="name"
							placeholder="Imię i nazwisko"
							required
							autoComplete="off"
						/>
					</p>

					<p>
						<input
							onChange={(e) => setMail(e.target.value)}
							value={mail}
							type="email"
							name="mail"
							placeholder="E-mail"
							required
							autoComplete="off"
						/>
					</p>

					<p>
						<input
							onChange={(e) => setPassword(e.target.value)}
							type="password"
							name="subject"
							placeholder="Hasło"
							required
							autoComplete="new-password"
						/>
					</p>
					<p className="log">
						Masz już konto?&nbsp;
						<Link to="/sign-in">
							<i>Zaloguj się!</i>
						</Link>
					</p>
					<p>
						<input type="submit" className="submit" value="Zarejestruj!" />
					</p>
          {info}
				</form>
			</div>
		</div>
	);
};

export default Register;
