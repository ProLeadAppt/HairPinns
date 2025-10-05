import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Helmet } from "react-helmet";
import { hpCapture } from "@/lib/hpCapture";
import { Button } from "@/components/ui/button";

const Confirm = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmSubscription = async () => {
      const token = searchParams.get('token');
      const email = searchParams.get('email');

      if (!token || !email) {
        setStatus('error');
        setMessage('Invalid confirmation link. Please check your email and try again, or contact our support team.');
        return;
      }

      try {
        // Fire confirmation event to Zapier
        const success = await hpCapture.trackEvent('email_confirmed', {
          email,
          confirmation_token: token,
        });

        if (success) {
          setStatus('success');
          setMessage('Your subscription is confirmed! Welcome to Hair Pinns. Check your inbox for your welcome email.');
        } else {
          throw new Error('Failed to confirm');
        }
      } catch (error) {
        console.error('Confirmation error:', error);
        setStatus('error');
        setMessage('Something went wrong confirming your subscription. Please try again or contact our support team.');
      }
    };

    confirmSubscription();
  }, [searchParams]);

  return (
    <>
      <Helmet>
        <title>Confirm Subscription | Hair Pinns</title>
        <meta name="description" content="Confirm your email subscription to Hair Pinns" />
        <link rel="canonical" href="https://hairpinns.com/confirm" />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full text-center space-y-6 bg-card p-8 rounded-card border border-border">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
              <h1 className="text-2xl font-heading text-heading">Confirming Your Subscription...</h1>
              <p className="text-foreground">Please wait while we verify your email address.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-500 mx-auto" />
              <h1 className="text-2xl font-heading text-heading">Subscription Confirmed!</h1>
              <p className="text-foreground">{message}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button asChild variant="primary" size="lg">
                  <Link to="/">Return to Home</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/collections">Shop Now</Link>
                </Button>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 text-destructive mx-auto" />
              <h1 className="text-2xl font-heading text-heading">Confirmation Failed</h1>
              <p className="text-foreground">{message}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button asChild variant="primary" size="lg">
                  <Link to="/contact">Contact Support</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/">Return to Home</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Confirm;
