import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Recycle, Mail, Lock, Loader2, ArrowLeft, Sparkles } from "lucide-react";
import authBg from "@/assets/auth-bg.jpg";

const Auth = () => {
  const { user, loading, signIn, signUp, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) return <Navigate to="/" replace />;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const { error } = await signIn(email, password);
    if (error) setError(error);
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setIsLoading(true);
    const { error } = await signUp(email, password);
    if (error) setError(error);
    else setSuccess("Conta criada com sucesso! Você já pode fazer login.");
    setIsLoading(false);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError("Digite seu e-mail para redefinir a senha.");
      return;
    }
    setIsLoading(true);
    const { error } = await resetPassword(email);
    if (error) setError(error);
    else setSuccess("E-mail de redefinição enviado! Verifique sua caixa de entrada.");
    setIsLoading(false);
  };

  const backgroundLayer = (
    <>
      <img
        src={authBg}
        alt="Moda sustentável - resíduos têxteis virando produto"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-teal/80 via-primary/60 to-olive/70 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
    </>
  );

  if (showReset) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
        {backgroundLayer}
        <Card className="relative z-10 w-full max-w-md border-0 shadow-2xl bg-card/90 backdrop-blur-xl">
          <CardHeader className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="p-2 rounded-full bg-primary/15">
                <Recycle className="w-7 h-7 text-primary" />
              </div>
            </div>
            <CardTitle className="text-xl font-display text-foreground">Redefinir Senha</CardTitle>
            <CardDescription>Digite seu e-mail para receber o link de redefinição</CardDescription>
          </CardHeader>
          <form onSubmit={handleReset}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
              )}
              {success && (
                <Alert><AlertDescription className="text-primary">{success}</AlertDescription></Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="reset-email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-9 border-primary/30 focus-visible:ring-primary/50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-teal-light text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enviar Link"}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => { setShowReset(false); setError(null); setSuccess(null); }}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao login
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      {backgroundLayer}
      <Card className="relative z-10 w-full max-w-md border-0 shadow-2xl bg-card/90 backdrop-blur-xl">
        <CardHeader className="text-center space-y-3 pb-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="p-2.5 rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
              <Recycle className="w-8 h-8 text-primary" />
            </div>
          </div>
          <span className="font-display font-bold text-2xl text-foreground">TextilCircular</span>
          <CardDescription className="flex items-center justify-center gap-1.5 text-sm">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            Gestão sustentável para a indústria têxtil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" onValueChange={() => { setError(null); setSuccess(null); }}>
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/60">
              <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold">Entrar</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold">Criar Conta</TabsTrigger>
            </TabsList>

            {error && (
              <Alert variant="destructive" className="mb-4"><AlertDescription>{error}</AlertDescription></Alert>
            )}
            {success && (
              <Alert className="mb-4"><AlertDescription className="text-primary">{success}</AlertDescription></Alert>
            )}

            <TabsContent value="login">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="font-medium">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-primary/60" />
                    <Input id="login-email" type="email" placeholder="seu@email.com" className="pl-9 border-primary/30 focus-visible:ring-primary/50" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="font-medium">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-primary/60" />
                    <Input id="login-password" type="password" placeholder="••••••" className="pl-9 border-primary/30 focus-visible:ring-primary/50" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-teal-light text-primary-foreground font-semibold shadow-lg hover:shadow-xl hover:brightness-110 transition-all h-11 text-base" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Entrar"}
                </Button>
                <Button type="button" variant="link" className="w-full text-sm text-primary/80 hover:text-primary" onClick={() => { setShowReset(true); setError(null); setSuccess(null); }}>
                  Esqueci minha senha
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="font-medium">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-primary/60" />
                    <Input id="signup-email" type="email" placeholder="seu@email.com" className="pl-9 border-primary/30 focus-visible:ring-primary/50" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="font-medium">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-primary/60" />
                    <Input id="signup-password" type="password" placeholder="Mínimo 6 caracteres" className="pl-9 border-primary/30 focus-visible:ring-primary/50" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-teal-light text-primary-foreground font-semibold shadow-lg hover:shadow-xl hover:brightness-110 transition-all h-11 text-base" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Criar Conta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
