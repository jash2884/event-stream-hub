import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { eventStore, generateUser } from '@/lib/mockData';
import { Verb } from '@/types/events';
import { toast } from 'sonner';

export function EventSimulator() {
  const [loading, setLoading] = useState(false);
  const [verb, setVerb] = useState<Verb>('like');
  const [objectType, setObjectType] = useState('post');
  const [objectTitle, setObjectTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const actor = generateUser();
    eventStore.addEvent({
      event_id: `evt_${Math.random().toString(36).substring(2, 11)}`,
      actor_id: actor.id,
      actor_name: actor.name,
      actor_avatar: actor.avatar,
      verb,
      object_type: objectType,
      object_id: `${objectType}_${Math.random().toString(36).substring(2, 9)}`,
      object_title: objectTitle || `Sample ${objectType}`,
      target_user_ids: ['current_user'],
      created_at: new Date().toISOString(),
    });

    toast.success('Event created successfully', {
      description: `${actor.name} ${verb}d a ${objectType}`,
    });

    setLoading(false);
    setObjectTitle('');
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Create Event</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Verb</Label>
              <Select value={verb} onValueChange={(v) => setVerb(v as Verb)}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="like">Like</SelectItem>
                  <SelectItem value="comment">Comment</SelectItem>
                  <SelectItem value="follow">Follow</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="share">Share</SelectItem>
                  <SelectItem value="mention">Mention</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Object Type</Label>
              <Select value={objectType} onValueChange={setObjectType}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="post">Post</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="repository">Repository</SelectItem>
                  <SelectItem value="profile">Profile</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Object Title (optional)</Label>
            <Input
              value={objectTitle}
              onChange={(e) => setObjectTitle(e.target.value)}
              placeholder="Enter a title..."
              className="h-9"
            />
          </div>

          <Button type="submit" className="w-full gap-2" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Create Event
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
