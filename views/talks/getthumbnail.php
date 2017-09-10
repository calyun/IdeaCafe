<?php
// modified from
// https://github.com/suth/video-thumbnails/tree/81c1418569b85ddae36b676c3b659b6b59856342/php/providers

class Video_Thumbnails_Provider {

	public $options = array();

	function __construct() {
		// If options are defined add the settings section
		if ( isset( $this->options_section ) ) add_action( 'admin_init', array( &$this, 'initialize_options' ) );
		// Get current settings for this provider
		$options = get_option( 'video_thumbnails' );
		if ( isset( $options['providers'][$this->service_slug] ) ) {
			$this->options = $options['providers'][$this->service_slug];
		}
	}

	function initialize_options() {
		add_settings_section(  
			$this->service_slug . '_provider_settings_section',
			$this->service_name . ' Settings',
			array( &$this, 'settings_section_callback' ),
			'video_thumbnails_providers'
		);
		foreach ( $this->options_section['fields'] as $key => $value ) {
			add_settings_field(
				$key,
				$value['name'],
				array( &$this, $value['type'] . '_setting_callback' ),
				'video_thumbnails_providers',
				$this->service_slug . '_provider_settings_section',
				array(
					'slug'        => $key,
					'description' => $value['description']
				)
			);
		}
	}

	/**
	 * Drops the parameters from a thumbnail URL
	 * @param  string $url
	 * @return string
	 */
	static function drop_url_parameters( $url ) {
		$url = explode( '?', $url );
		return $url[0];
	}

	function construct_info_retrieval_error( $request, $response ) {
        return "Error";
	}
}

class Ted_Thumbnails extends Video_Thumbnails_Provider {

	// Human-readable name of the video provider
	public $service_name = 'TED';
	const service_name = 'TED';
	// Slug for the video provider
	public $service_slug = 'ted';
	const service_slug = 'ted';

	public static function register_provider( $providers ) {
		$providers[self::service_slug] = new self;
		return $providers;
	}

	// Regex strings
	public $regexes = array(
		'#//embed(?:\-ssl)?\.ted\.com/talks/(?:lang/[A-Za-z_-]+/)?([A-Za-z0-9_-]+)\.html#', // iFrame SRC
	);

	// Thumbnail URL
	public function get_thumbnail_url( $id ) {
		$request = "http://www.ted.com/talks/oembed.json?url=http%3A%2F%2Fwww.ted.com%2Ftalks%2F$id";
		$response = wp_remote_get( $request );
		if( is_wp_error( $response ) ) {
			$result = $this->construct_info_retrieval_error( $request, $response );
		} else {
			$result = json_decode( $response['body'] );
			$result = str_replace( '240x180.jpg', '480x360.jpg', $result->thumbnail_url );
		}
		return $result;
	}

	// Test cases
	public static function get_test_cases() {
		return array(
			array(
				'markup'        => '<iframe src="http://embed.ted.com/talks/kitra_cahana_stories_of_the_homeless_and_hidden.html" width="640" height="360" frameborder="0" scrolling="no" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>',
				'expected'      => 'http://images.ted.com/images/ted/341053090f8bac8c324c75be3114b673b4355e8a_480x360.jpg?lang=en',
				'expected_hash' => 'f2a5f6af49e841b4f9c7b95d6ca0372a',
				'name'          => __( 'iFrame Embed', 'video-thumbnails' )
			),
			array(
				'markup'        => '<iframe src="https://embed-ssl.ted.com/talks/lang/fr-ca/shimpei_takahashi_play_this_game_to_come_up_with_original_ideas.html" width="640" height="360" frameborder="0" scrolling="no" allowfullscreen="allowfullscreen"></iframe>',
				'expected'      => 'http://images.ted.com/images/ted/b1f1183311cda4df9e1b65f2b363e0b806bff914_480x360.jpg?lang=en',
				'expected_hash' => 'ff47c99c9eb95e3d6c4b986b18991f22',
				'name'          => __( 'Custom Language', 'video-thumbnails' )
			),
		);
	}
	
}

// Pass video_name_id into PHP
// $video_name_id = "anab_jain_why_we_need_to_imagine_different_futures";
// $thumb_provider = new Ted_Thumbnails;
// $thumbnail_url = $item->{'get_thumbnail_url'}($video_name_id);
// echo json_encode($thumbnail_url)

?>