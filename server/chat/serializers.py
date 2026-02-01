from rest_framework import serializers

from .models import Conversation, Message
from matching.serializers import JobMatchSerializer


class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    sender_id = serializers.IntegerField(source='sender.id', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender_id', 'sender_username', 'content', 'created_at']
        read_only_fields = ['id', 'conversation', 'sender_id', 'sender_username', 'created_at']


class ConversationSerializer(serializers.ModelSerializer):
    job = JobMatchSerializer(read_only=True)
    volunteer_username = serializers.CharField(source='volunteer.username', read_only=True)
    volunteer_id = serializers.IntegerField(source='volunteer.id', read_only=True)
    poster_username = serializers.CharField(source='poster.username', read_only=True)
    poster_id = serializers.IntegerField(source='poster.id', read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            'id', 'job', 'volunteer_id', 'volunteer_username',
            'poster_id', 'poster_username', 'last_message', 'unread_count',
            'created_at', 'updated_at'
        ]

    def get_last_message(self, obj):
        last = obj.messages.order_by('-created_at').first()
        if last:
            return {
                'content': last.content[:100],
                'sender_username': last.sender.username,
                'created_at': last.created_at,
            }
        return None

    def get_unread_count(self, obj):
        request = self.context.get('request')
        if not request or not request.user:
            return 0

        user = request.user
        # Determine which last_read timestamp to use based on user role
        if user.id == obj.volunteer_id:
            last_read = obj.volunteer_last_read
            # Count messages from the poster (the other party)
            other_party_id = obj.poster_id
        elif user.id == obj.poster_id:
            last_read = obj.poster_last_read
            # Count messages from the volunteer (the other party)
            other_party_id = obj.volunteer_id
        else:
            return 0

        # Count messages from the other party that are newer than last_read
        messages = obj.messages.filter(sender_id=other_party_id)
        if last_read:
            messages = messages.filter(created_at__gt=last_read)
        return messages.count()


class SendMessageSerializer(serializers.Serializer):
    content = serializers.CharField(max_length=2000)
