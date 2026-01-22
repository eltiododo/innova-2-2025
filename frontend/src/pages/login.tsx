import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useAuthStore } from '@/stores';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck } from 'lucide-react';

export const LoginPage = observer(function LoginPage() {
	const authStore = useAuthStore();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await authStore.login(email, password);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<div className="flex items-center justify-center mb-4">
						<Truck className="h-12 w-12 text-blue-500" />
					</div>
					<CardTitle className="text-2xl text-center">
						FleetIQ
					</CardTitle>
					<p className="text-center text-muted-foreground">
						Ingresa tus credenciales para continuar
					</p>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<Input
								type="email"
								placeholder="Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div>
							<Input
								type="password"
								placeholder="Contraseña"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						<Button
							type="submit"
							className="w-full"
							disabled={authStore.isLoading}
						>
							{authStore.isLoading
								? 'Iniciando sesión...'
								: 'Iniciar Sesión'}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
});
