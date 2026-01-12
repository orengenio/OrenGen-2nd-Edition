// AI Avatar Video Service
// Create hyper-realistic avatar videos like HeyGen/Synthesia

export interface AIAvatar {
  id: string;
  name: string;
  type: 'stock' | 'custom' | 'cloned';
  gender: 'male' | 'female' | 'neutral';
  ethnicity: string;
  age_range: string;
  preview_url: string;
  video_preview_url: string;
  supported_languages: string[];
  voice_id: string;
  style: 'professional' | 'casual' | 'friendly' | 'authoritative';
  use_cases: string[];
  is_premium: boolean;
}

export interface VoiceProfile {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'neutral';
  language: string;
  accent: string;
  style: 'conversational' | 'narrative' | 'newscast' | 'excited';
  preview_url: string;
  provider: 'elevenlabs' | 'playht' | 'azure' | 'custom';
  is_cloned: boolean;
}

export interface VideoTemplate {
  id: string;
  name: string;
  category: 'sales' | 'training' | 'marketing' | 'support' | 'webinar' | 'social';
  thumbnail: string;
  duration_range: string;
  scenes: TemplateScene[];
  aspect_ratio: '16:9' | '9:16' | '1:1';
  recommended_avatars: string[];
}

export interface TemplateScene {
  id: string;
  name: string;
  duration: number;
  background_type: 'solid' | 'gradient' | 'image' | 'video';
  background_value: string;
  avatar_position: 'left' | 'center' | 'right' | 'floating';
  avatar_size: 'small' | 'medium' | 'large' | 'full';
  text_overlay?: {
    content: string;
    position: string;
    style: string;
  };
  elements: SceneElement[];
}

export interface SceneElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'chart' | 'screen_recording' | 'logo';
  content: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
  animation: 'fade_in' | 'slide_in' | 'zoom' | 'none';
}

export interface VideoProject {
  id: string;
  name: string;
  status: 'draft' | 'processing' | 'completed' | 'failed';
  avatar_id: string;
  voice_id: string;
  template_id?: string;
  script: VideoScript;
  scenes: ProjectScene[];
  settings: VideoSettings;
  output?: VideoOutput;
  created_at: Date;
  updated_at: Date;
}

export interface VideoScript {
  full_text: string;
  segments: ScriptSegment[];
  total_duration: number;
  word_count: number;
}

export interface ScriptSegment {
  id: string;
  scene_id: string;
  text: string;
  start_time: number;
  end_time: number;
  emphasis?: string[];
  pause_after?: number;
}

export interface ProjectScene {
  id: string;
  order: number;
  name: string;
  duration: number;
  script_segment_id: string;
  background: {
    type: 'color' | 'gradient' | 'image' | 'video';
    value: string;
  };
  avatar: {
    visible: boolean;
    position: string;
    size: string;
    gesture?: string;
  };
  elements: SceneElement[];
  transition: 'cut' | 'fade' | 'slide' | 'zoom';
}

export interface VideoSettings {
  resolution: '720p' | '1080p' | '4k';
  aspect_ratio: '16:9' | '9:16' | '1:1';
  fps: 24 | 30 | 60;
  background_music?: string;
  music_volume: number;
  voice_volume: number;
  captions: boolean;
  caption_style?: string;
  watermark?: boolean;
  brand_kit?: {
    logo: string;
    colors: string[];
    fonts: string[];
  };
}

export interface VideoOutput {
  url: string;
  thumbnail: string;
  duration: number;
  file_size: number;
  format: 'mp4' | 'webm';
  captions_url?: string;
  render_time: number;
}

export interface WebinarConfig {
  id: string;
  title: string;
  description: string;
  avatar_id: string;
  voice_id: string;
  duration_minutes: number;
  sections: WebinarSection[];
  interactive_elements: InteractiveElement[];
  registration_required: boolean;
  schedule?: Date;
  replay_available: boolean;
}

export interface WebinarSection {
  id: string;
  title: string;
  type: 'intro' | 'content' | 'demo' | 'qa' | 'cta' | 'outro';
  duration_minutes: number;
  script: string;
  slides?: string[];
  screen_share?: boolean;
}

export interface InteractiveElement {
  id: string;
  type: 'poll' | 'quiz' | 'cta_button' | 'chat_prompt' | 'resource_download';
  trigger_time: number;
  config: any;
}

class AIAvatarService {
  private avatars: Map<string, AIAvatar> = new Map();
  private voices: Map<string, VoiceProfile> = new Map();
  private templates: Map<string, VideoTemplate> = new Map();
  private projects: Map<string, VideoProject> = new Map();
  private webinars: Map<string, WebinarConfig> = new Map();

  constructor() {
    this.initializeStockAvatars();
    this.initializeVoices();
    this.initializeTemplates();
  }

  private initializeStockAvatars() {
    const stockAvatars: AIAvatar[] = [
      {
        id: 'avatar_sarah',
        name: 'Sarah',
        type: 'stock',
        gender: 'female',
        ethnicity: 'caucasian',
        age_range: '25-35',
        preview_url: '/avatars/sarah_preview.png',
        video_preview_url: '/avatars/sarah_video.mp4',
        supported_languages: ['English', 'Spanish', 'French', 'German'],
        voice_id: 'voice_sarah',
        style: 'professional',
        use_cases: ['sales', 'training', 'marketing'],
        is_premium: false
      },
      {
        id: 'avatar_marcus',
        name: 'Marcus',
        type: 'stock',
        gender: 'male',
        ethnicity: 'african_american',
        age_range: '30-40',
        preview_url: '/avatars/marcus_preview.png',
        video_preview_url: '/avatars/marcus_video.mp4',
        supported_languages: ['English', 'Spanish'],
        voice_id: 'voice_marcus',
        style: 'authoritative',
        use_cases: ['executive', 'training', 'announcements'],
        is_premium: false
      },
      {
        id: 'avatar_mei',
        name: 'Mei',
        type: 'stock',
        gender: 'female',
        ethnicity: 'asian',
        age_range: '25-35',
        preview_url: '/avatars/mei_preview.png',
        video_preview_url: '/avatars/mei_video.mp4',
        supported_languages: ['English', 'Mandarin', 'Japanese', 'Korean'],
        voice_id: 'voice_mei',
        style: 'friendly',
        use_cases: ['customer_support', 'onboarding', 'social'],
        is_premium: false
      },
      {
        id: 'avatar_james',
        name: 'James',
        type: 'stock',
        gender: 'male',
        ethnicity: 'caucasian',
        age_range: '35-45',
        preview_url: '/avatars/james_preview.png',
        video_preview_url: '/avatars/james_video.mp4',
        supported_languages: ['English', 'German', 'French'],
        voice_id: 'voice_james',
        style: 'professional',
        use_cases: ['executive', 'sales', 'webinar'],
        is_premium: true
      },
      {
        id: 'avatar_priya',
        name: 'Priya',
        type: 'stock',
        gender: 'female',
        ethnicity: 'south_asian',
        age_range: '25-35',
        preview_url: '/avatars/priya_preview.png',
        video_preview_url: '/avatars/priya_video.mp4',
        supported_languages: ['English', 'Hindi'],
        voice_id: 'voice_priya',
        style: 'friendly',
        use_cases: ['training', 'explainer', 'social'],
        is_premium: false
      },
      {
        id: 'avatar_carlos',
        name: 'Carlos',
        type: 'stock',
        gender: 'male',
        ethnicity: 'hispanic',
        age_range: '30-40',
        preview_url: '/avatars/carlos_preview.png',
        video_preview_url: '/avatars/carlos_video.mp4',
        supported_languages: ['English', 'Spanish', 'Portuguese'],
        voice_id: 'voice_carlos',
        style: 'casual',
        use_cases: ['social', 'marketing', 'announcements'],
        is_premium: false
      }
    ];

    stockAvatars.forEach(avatar => this.avatars.set(avatar.id, avatar));
  }

  private initializeVoices() {
    const voices: VoiceProfile[] = [
      { id: 'voice_sarah', name: 'Sarah', gender: 'female', language: 'English', accent: 'American', style: 'conversational', preview_url: '/voices/sarah.mp3', provider: 'elevenlabs', is_cloned: false },
      { id: 'voice_marcus', name: 'Marcus', gender: 'male', language: 'English', accent: 'American', style: 'narrative', preview_url: '/voices/marcus.mp3', provider: 'elevenlabs', is_cloned: false },
      { id: 'voice_mei', name: 'Mei', gender: 'female', language: 'English', accent: 'Neutral', style: 'conversational', preview_url: '/voices/mei.mp3', provider: 'elevenlabs', is_cloned: false },
      { id: 'voice_james', name: 'James', gender: 'male', language: 'English', accent: 'British', style: 'narrative', preview_url: '/voices/james.mp3', provider: 'elevenlabs', is_cloned: false },
      { id: 'voice_priya', name: 'Priya', gender: 'female', language: 'English', accent: 'Neutral', style: 'excited', preview_url: '/voices/priya.mp3', provider: 'elevenlabs', is_cloned: false },
      { id: 'voice_carlos', name: 'Carlos', gender: 'male', language: 'English', accent: 'Neutral', style: 'conversational', preview_url: '/voices/carlos.mp3', provider: 'elevenlabs', is_cloned: false },
      { id: 'voice_newscast', name: 'Newscast', gender: 'neutral', language: 'English', accent: 'American', style: 'newscast', preview_url: '/voices/newscast.mp3', provider: 'azure', is_cloned: false }
    ];

    voices.forEach(voice => this.voices.set(voice.id, voice));
  }

  private initializeTemplates() {
    const templates: VideoTemplate[] = [
      {
        id: 'tmpl_sales_pitch',
        name: 'Sales Pitch',
        category: 'sales',
        thumbnail: '/templates/sales_pitch.png',
        duration_range: '1-3 min',
        aspect_ratio: '16:9',
        recommended_avatars: ['avatar_sarah', 'avatar_james'],
        scenes: [
          { id: 's1', name: 'Hook', duration: 15, background_type: 'gradient', background_value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', avatar_position: 'center', avatar_size: 'large', elements: [] },
          { id: 's2', name: 'Problem', duration: 30, background_type: 'solid', background_value: '#1a1a2e', avatar_position: 'left', avatar_size: 'medium', elements: [] },
          { id: 's3', name: 'Solution', duration: 45, background_type: 'solid', background_value: '#16213e', avatar_position: 'right', avatar_size: 'medium', elements: [] },
          { id: 's4', name: 'CTA', duration: 15, background_type: 'gradient', background_value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', avatar_position: 'center', avatar_size: 'large', elements: [] }
        ]
      },
      {
        id: 'tmpl_training',
        name: 'Training Module',
        category: 'training',
        thumbnail: '/templates/training.png',
        duration_range: '5-15 min',
        aspect_ratio: '16:9',
        recommended_avatars: ['avatar_marcus', 'avatar_priya'],
        scenes: [
          { id: 's1', name: 'Introduction', duration: 30, background_type: 'image', background_value: '/backgrounds/office.jpg', avatar_position: 'left', avatar_size: 'medium', elements: [] },
          { id: 's2', name: 'Content', duration: 300, background_type: 'solid', background_value: '#ffffff', avatar_position: 'floating', avatar_size: 'small', elements: [] },
          { id: 's3', name: 'Summary', duration: 30, background_type: 'gradient', background_value: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)', avatar_position: 'center', avatar_size: 'large', elements: [] }
        ]
      },
      {
        id: 'tmpl_social_short',
        name: 'Social Short',
        category: 'social',
        thumbnail: '/templates/social_short.png',
        duration_range: '15-60 sec',
        aspect_ratio: '9:16',
        recommended_avatars: ['avatar_mei', 'avatar_carlos'],
        scenes: [
          { id: 's1', name: 'Hook', duration: 5, background_type: 'video', background_value: '/backgrounds/dynamic.mp4', avatar_position: 'center', avatar_size: 'full', elements: [] },
          { id: 's2', name: 'Content', duration: 40, background_type: 'gradient', background_value: 'linear-gradient(180deg, #000428 0%, #004e92 100%)', avatar_position: 'center', avatar_size: 'large', elements: [] },
          { id: 's3', name: 'CTA', duration: 10, background_type: 'solid', background_value: '#ff6b6b', avatar_position: 'center', avatar_size: 'large', elements: [] }
        ]
      },
      {
        id: 'tmpl_webinar',
        name: 'Webinar',
        category: 'webinar',
        thumbnail: '/templates/webinar.png',
        duration_range: '30-60 min',
        aspect_ratio: '16:9',
        recommended_avatars: ['avatar_james', 'avatar_sarah'],
        scenes: [
          { id: 's1', name: 'Welcome', duration: 120, background_type: 'image', background_value: '/backgrounds/stage.jpg', avatar_position: 'center', avatar_size: 'large', elements: [] },
          { id: 's2', name: 'Presentation', duration: 1800, background_type: 'solid', background_value: '#1e1e1e', avatar_position: 'floating', avatar_size: 'small', elements: [] },
          { id: 's3', name: 'Q&A', duration: 600, background_type: 'gradient', background_value: 'linear-gradient(to bottom, #0f0c29, #302b63, #24243e)', avatar_position: 'center', avatar_size: 'medium', elements: [] },
          { id: 's4', name: 'Closing', duration: 60, background_type: 'image', background_value: '/backgrounds/stage.jpg', avatar_position: 'center', avatar_size: 'large', elements: [] }
        ]
      },
      {
        id: 'tmpl_product_demo',
        name: 'Product Demo',
        category: 'marketing',
        thumbnail: '/templates/product_demo.png',
        duration_range: '2-5 min',
        aspect_ratio: '16:9',
        recommended_avatars: ['avatar_sarah', 'avatar_mei'],
        scenes: [
          { id: 's1', name: 'Intro', duration: 20, background_type: 'gradient', background_value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', avatar_position: 'center', avatar_size: 'large', elements: [] },
          { id: 's2', name: 'Demo', duration: 180, background_type: 'solid', background_value: '#0a0a0a', avatar_position: 'floating', avatar_size: 'small', elements: [] },
          { id: 's3', name: 'Benefits', duration: 60, background_type: 'solid', background_value: '#1a1a2e', avatar_position: 'left', avatar_size: 'medium', elements: [] },
          { id: 's4', name: 'CTA', duration: 20, background_type: 'gradient', background_value: 'linear-gradient(to right, #f5576c, #f093fb)', avatar_position: 'center', avatar_size: 'large', elements: [] }
        ]
      }
    ];

    templates.forEach(template => this.templates.set(template.id, template));
  }

  // Create custom avatar from video/image
  async createCustomAvatar(config: {
    name: string;
    training_video?: File;
    training_images?: File[];
    voice_sample?: File;
    style: AIAvatar['style'];
  }): Promise<AIAvatar> {
    // In production, this would send to AI training pipeline
    const avatar: AIAvatar = {
      id: `avatar_custom_${Date.now()}`,
      name: config.name,
      type: 'custom',
      gender: 'neutral',
      ethnicity: 'custom',
      age_range: 'custom',
      preview_url: `/avatars/custom/${Date.now()}_preview.png`,
      video_preview_url: `/avatars/custom/${Date.now()}_video.mp4`,
      supported_languages: ['English'],
      voice_id: config.voice_sample ? `voice_custom_${Date.now()}` : 'voice_sarah',
      style: config.style,
      use_cases: ['custom'],
      is_premium: true
    };

    this.avatars.set(avatar.id, avatar);
    return avatar;
  }

  // Clone voice from audio sample
  async cloneVoice(config: {
    name: string;
    audio_samples: File[];
    language: string;
  }): Promise<VoiceProfile> {
    // In production, this would call ElevenLabs voice cloning API
    const voice: VoiceProfile = {
      id: `voice_cloned_${Date.now()}`,
      name: config.name,
      gender: 'neutral',
      language: config.language,
      accent: 'Custom',
      style: 'conversational',
      preview_url: `/voices/cloned/${Date.now()}.mp3`,
      provider: 'elevenlabs',
      is_cloned: true
    };

    this.voices.set(voice.id, voice);
    return voice;
  }

  // Create video project
  async createVideoProject(config: {
    name: string;
    avatar_id: string;
    voice_id: string;
    template_id?: string;
    script: string;
    settings?: Partial<VideoSettings>;
  }): Promise<VideoProject> {
    const template = config.template_id ? this.templates.get(config.template_id) : null;

    // Parse script into segments
    const segments = this.parseScriptIntoSegments(config.script, template?.scenes || []);

    const project: VideoProject = {
      id: `proj_${Date.now()}`,
      name: config.name,
      status: 'draft',
      avatar_id: config.avatar_id,
      voice_id: config.voice_id,
      template_id: config.template_id,
      script: {
        full_text: config.script,
        segments,
        total_duration: segments.reduce((sum, s) => sum + (s.end_time - s.start_time), 0),
        word_count: config.script.split(/\s+/).length
      },
      scenes: template ? this.createScenesFromTemplate(template, segments) : this.createDefaultScenes(segments),
      settings: {
        resolution: '1080p',
        aspect_ratio: template?.aspect_ratio || '16:9',
        fps: 30,
        music_volume: 20,
        voice_volume: 100,
        captions: true,
        watermark: false,
        ...config.settings
      },
      created_at: new Date(),
      updated_at: new Date()
    };

    this.projects.set(project.id, project);
    return project;
  }

  // Generate video from project
  async generateVideo(project_id: string): Promise<VideoOutput> {
    const project = this.projects.get(project_id);
    if (!project) throw new Error('Project not found');

    project.status = 'processing';

    // In production, this would:
    // 1. Generate voice audio from script using TTS
    // 2. Generate lip-synced avatar video
    // 3. Composite with backgrounds and elements
    // 4. Add music and captions
    // 5. Render final video

    // Simulate processing time based on duration
    const processingTime = Math.max(30, project.script.total_duration * 0.5);

    const output: VideoOutput = {
      url: `https://cdn.orengen.io/videos/${project.id}.mp4`,
      thumbnail: `https://cdn.orengen.io/videos/${project.id}_thumb.jpg`,
      duration: project.script.total_duration,
      file_size: project.script.total_duration * 2 * 1024 * 1024, // ~2MB per second estimate
      format: 'mp4',
      captions_url: project.settings.captions ? `https://cdn.orengen.io/videos/${project.id}.vtt` : undefined,
      render_time: processingTime
    };

    project.output = output;
    project.status = 'completed';
    project.updated_at = new Date();

    return output;
  }

  // Create AI webinar
  async createWebinar(config: {
    title: string;
    topic: string;
    avatar_id: string;
    voice_id: string;
    duration_minutes: number;
    target_audience: string;
    key_points: string[];
    include_qa: boolean;
    cta: { text: string; url: string };
  }): Promise<WebinarConfig> {
    // Generate webinar structure and script using AI
    const sections = this.generateWebinarSections(config);

    const webinar: WebinarConfig = {
      id: `webinar_${Date.now()}`,
      title: config.title,
      description: `AI-generated webinar about ${config.topic} for ${config.target_audience}`,
      avatar_id: config.avatar_id,
      voice_id: config.voice_id,
      duration_minutes: config.duration_minutes,
      sections,
      interactive_elements: [
        { id: 'ie1', type: 'poll', trigger_time: 300, config: { question: 'How familiar are you with this topic?', options: ['Expert', 'Intermediate', 'Beginner'] } },
        { id: 'ie2', type: 'cta_button', trigger_time: sections.reduce((sum, s) => sum + s.duration_minutes * 60, 0) - 60, config: { text: config.cta.text, url: config.cta.url } }
      ],
      registration_required: true,
      replay_available: true
    };

    this.webinars.set(webinar.id, webinar);
    return webinar;
  }

  // Generate webinar video
  async generateWebinarVideo(webinar_id: string): Promise<VideoOutput> {
    const webinar = this.webinars.get(webinar_id);
    if (!webinar) throw new Error('Webinar not found');

    // Combine all section scripts
    const fullScript = webinar.sections.map(s => s.script).join('\n\n');

    // Create video project from webinar
    const project = await this.createVideoProject({
      name: webinar.title,
      avatar_id: webinar.avatar_id,
      voice_id: webinar.voice_id,
      template_id: 'tmpl_webinar',
      script: fullScript,
      settings: {
        resolution: '1080p',
        aspect_ratio: '16:9',
        captions: true
      }
    });

    return this.generateVideo(project.id);
  }

  // Script generation for webinars
  private generateWebinarSections(config: {
    topic: string;
    duration_minutes: number;
    key_points: string[];
    include_qa: boolean;
    cta: { text: string; url: string };
  }): WebinarSection[] {
    const sections: WebinarSection[] = [];

    // Intro (10% of duration)
    const introDuration = Math.max(2, Math.round(config.duration_minutes * 0.1));
    sections.push({
      id: 'section_intro',
      title: 'Welcome & Introduction',
      type: 'intro',
      duration_minutes: introDuration,
      script: `Welcome everyone to today's session on ${config.topic}. I'm excited to share some valuable insights with you. Over the next ${config.duration_minutes} minutes, we'll cover everything you need to know. Let's dive in!`
    });

    // Content sections (70% of duration, split among key points)
    const contentDuration = Math.round(config.duration_minutes * 0.7);
    const perPointDuration = Math.round(contentDuration / config.key_points.length);

    config.key_points.forEach((point, index) => {
      sections.push({
        id: `section_content_${index + 1}`,
        title: point,
        type: 'content',
        duration_minutes: perPointDuration,
        script: `Now let's talk about ${point}. This is crucial because... [AI would generate detailed content here based on the topic and point]`,
        slides: [`/slides/${config.topic.replace(/\s+/g, '_')}_${index + 1}.png`]
      });
    });

    // Q&A if included (15% of duration)
    if (config.include_qa) {
      const qaDuration = Math.max(5, Math.round(config.duration_minutes * 0.15));
      sections.push({
        id: 'section_qa',
        title: 'Questions & Answers',
        type: 'qa',
        duration_minutes: qaDuration,
        script: `Now let's address some common questions about ${config.topic}. [AI would generate FAQ responses]`
      });
    }

    // Closing with CTA (5% of duration)
    const closingDuration = Math.max(1, Math.round(config.duration_minutes * 0.05));
    sections.push({
      id: 'section_cta',
      title: 'Next Steps',
      type: 'cta',
      duration_minutes: closingDuration,
      script: `Thank you for joining me today! If you found this valuable, ${config.cta.text}. The link is on your screen now. I look forward to seeing you take action on what you've learned today!`
    });

    return sections;
  }

  // Helper methods
  private parseScriptIntoSegments(script: string, templateScenes: TemplateScene[]): ScriptSegment[] {
    const sentences = script.split(/[.!?]+/).filter(s => s.trim());
    const wordsPerMinute = 150;
    const segments: ScriptSegment[] = [];
    let currentTime = 0;

    sentences.forEach((sentence, index) => {
      const words = sentence.trim().split(/\s+/).length;
      const duration = (words / wordsPerMinute) * 60;
      const sceneId = templateScenes[index % templateScenes.length]?.id || `scene_${index}`;

      segments.push({
        id: `seg_${index}`,
        scene_id: sceneId,
        text: sentence.trim(),
        start_time: currentTime,
        end_time: currentTime + duration,
        pause_after: 0.5
      });

      currentTime += duration + 0.5;
    });

    return segments;
  }

  private createScenesFromTemplate(template: VideoTemplate, segments: ScriptSegment[]): ProjectScene[] {
    return template.scenes.map((scene, index) => ({
      id: scene.id,
      order: index,
      name: scene.name,
      duration: scene.duration,
      script_segment_id: segments[index]?.id || segments[0].id,
      background: {
        type: scene.background_type as 'color' | 'gradient' | 'image' | 'video',
        value: scene.background_value
      },
      avatar: {
        visible: true,
        position: scene.avatar_position,
        size: scene.avatar_size
      },
      elements: scene.elements,
      transition: 'fade'
    }));
  }

  private createDefaultScenes(segments: ScriptSegment[]): ProjectScene[] {
    return segments.map((segment, index) => ({
      id: `scene_${index}`,
      order: index,
      name: `Scene ${index + 1}`,
      duration: segment.end_time - segment.start_time,
      script_segment_id: segment.id,
      background: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      },
      avatar: {
        visible: true,
        position: 'center',
        size: 'large'
      },
      elements: [],
      transition: 'fade'
    }));
  }

  // Getters
  async getAvatars(filter?: { type?: string; style?: string }): Promise<AIAvatar[]> {
    let avatars = Array.from(this.avatars.values());
    if (filter?.type) avatars = avatars.filter(a => a.type === filter.type);
    if (filter?.style) avatars = avatars.filter(a => a.style === filter.style);
    return avatars;
  }

  async getVoices(filter?: { language?: string; gender?: string }): Promise<VoiceProfile[]> {
    let voices = Array.from(this.voices.values());
    if (filter?.language) voices = voices.filter(v => v.language === filter.language);
    if (filter?.gender) voices = voices.filter(v => v.gender === filter.gender);
    return voices;
  }

  async getTemplates(category?: string): Promise<VideoTemplate[]> {
    let templates = Array.from(this.templates.values());
    if (category) templates = templates.filter(t => t.category === category);
    return templates;
  }

  async getProject(id: string): Promise<VideoProject | undefined> {
    return this.projects.get(id);
  }

  async getProjects(): Promise<VideoProject[]> {
    return Array.from(this.projects.values());
  }

  async getWebinars(): Promise<WebinarConfig[]> {
    return Array.from(this.webinars.values());
  }
}

export const aiAvatarService = new AIAvatarService();
