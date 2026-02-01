"""
Geocoding utilities for converting coordinates to location labels.
Uses OpenStreetMap Nominatim API (free, no API key required).
"""
import logging
import requests
from django.core.cache import cache

logger = logging.getLogger(__name__)

NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse"
CACHE_TIMEOUT = 86400  # 24 hours


def _cache_key(lat: float, lng: float) -> str:
    """Generate cache key for coordinates (rounded to ~1km precision)."""
    return f"geocode:{round(lat, 2)}:{round(lng, 2)}"


def reverse_geocode(lat: float, lng: float) -> str:
    """
    Convert coordinates to a human-readable location label.
    Returns city/state format like "Lansing, MI" or fallback "Nearby".

    Uses OpenStreetMap Nominatim with caching to avoid rate limits.
    """
    if lat is None or lng is None:
        return ""

    # Check cache first
    cache_key = _cache_key(lat, lng)
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    try:
        response = requests.get(
            NOMINATIM_URL,
            params={
                'lat': lat,
                'lon': lng,
                'format': 'json',
                'addressdetails': 1,
                'zoom': 10,  # City-level detail
            },
            headers={
                'User-Agent': 'VolunteerMatchmaker/1.0',
            },
            timeout=5,
        )
        response.raise_for_status()
        data = response.json()

        address = data.get('address', {})

        # Build location label from address components
        city = (
            address.get('city') or
            address.get('town') or
            address.get('village') or
            address.get('municipality') or
            address.get('county', '').replace(' County', '')
        )

        state = address.get('state', '')
        country = address.get('country_code', '').upper()

        # Format based on country
        if country == 'US':
            # Use state abbreviation for US
            state_abbrev = _us_state_abbrev(state)
            if city and state_abbrev:
                label = f"{city}, {state_abbrev}"
            elif city:
                label = city
            elif state_abbrev:
                label = state_abbrev
            else:
                label = "United States"
        elif city and state:
            label = f"{city}, {state}"
        elif city:
            label = city
        elif state:
            label = state
        else:
            label = address.get('country', 'Nearby')

        # Cache the result
        cache.set(cache_key, label, timeout=CACHE_TIMEOUT)
        return label

    except requests.RequestException as e:
        logger.warning(f"Geocoding failed for ({lat}, {lng}): {e}")
        return "Nearby"
    except (KeyError, ValueError) as e:
        logger.warning(f"Geocoding parse error for ({lat}, {lng}): {e}")
        return "Nearby"


def _us_state_abbrev(state_name: str) -> str:
    """Convert US state name to abbreviation."""
    states = {
        'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
        'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
        'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
        'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
        'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
        'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
        'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
        'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
        'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
        'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
        'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
        'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
        'Wisconsin': 'WI', 'Wyoming': 'WY', 'District of Columbia': 'DC',
    }
    return states.get(state_name, state_name[:2].upper() if state_name else '')


def forward_geocode(query: str) -> tuple[float, float, str] | None:
    """
    Convert address/city/ZIP to coordinates.
    Returns (lat, lng, label) tuple or None if not found.
    """
    if not query or not query.strip():
        return None

    try:
        response = requests.get(
            "https://nominatim.openstreetmap.org/search",
            params={
                'q': query,
                'format': 'json',
                'limit': 1,
                'addressdetails': 1,
            },
            headers={
                'User-Agent': 'VolunteerMatchmaker/1.0',
            },
            timeout=5,
        )
        response.raise_for_status()
        results = response.json()

        if not results:
            return None

        result = results[0]
        lat = float(result['lat'])
        lng = float(result['lon'])

        # Get a clean label
        label = reverse_geocode(lat, lng)

        return (lat, lng, label)

    except (requests.RequestException, KeyError, ValueError) as e:
        logger.warning(f"Forward geocoding failed for '{query}': {e}")
        return None


def format_distance(miles: float) -> str:
    """Format distance for display (rounded, privacy-friendly)."""
    if miles is None:
        return "Distance unknown"
    if miles < 0.5:
        return "Less than 0.5 mi"
    if miles < 1:
        return "~0.5 mi"
    if miles < 10:
        return f"~{round(miles)} mi"
    # Round to nearest 5 for larger distances
    rounded = round(miles / 5) * 5
    return f"~{int(rounded)} mi"
