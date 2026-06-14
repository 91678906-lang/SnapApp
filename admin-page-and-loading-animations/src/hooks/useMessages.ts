// ============================================================================
//  👂 useMessages : un "hook" qui renvoie la liste des messages et se met à
//  jour TOUT SEUL quand des nouveaux arrivent.
// ----------------------------------------------------------------------------
//  Il utilise "subscribeToMessages" du store :
//   - en mode en ligne, Firestore nous prévient en temps réel ;
//   - en mode local, on écoute les changements de la mémoire du navigateur.
// ============================================================================

import { useEffect, useState } from "react";
import { subscribeToMessages, type UserMessage } from "../lib/store";

export function useMessages(): { messages: UserMessage[]; loading: boolean } {
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On s'abonne : à chaque changement, la liste est mise à jour automatiquement.
    const unsubscribe = subscribeToMessages((list) => {
      setMessages(list);
      setLoading(false);
    });
    // Nettoyage : on se désabonne quand le composant disparaît.
    return unsubscribe;
  }, []);

  return { messages, loading };
}
