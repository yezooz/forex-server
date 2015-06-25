# The MIT License (MIT)
#
# Copyright (c) 2013 Marek Mikuliszyn
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.

try:
    from shared_settings import *
    from forex_settings import *
except ImportError:
    pass

DATABASES['default']['PASSWORD'] = ''

ALLOWED_HOSTS = []
DEBUG = False
TEMPLATE_DEBUG = DEBUG

# Static files served by NGINX on prod
STATICFILES_DIRS = []
STATICFILES_FINDERS = []
STATIC_URL = ''

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.db.DatabaseCache',
        'LOCATION': 'cache',
        'TIMEOUT': 60 * 60 * 24 * 356,
    }
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'standard': {
            'format': "[%(asctime)s] %(levelname)s [%(name)s:%(lineno)s] %(message)s",
            'datefmt': "%d/%b/%Y %H:%M:%S"
        },
    },
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'null': {
            'level': 'DEBUG',
            'class': 'django.utils.log.NullHandler',
        },
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        },
        'logfile': {
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'logs/log.log',
            'maxBytes': 50000,
            'backupCount': 2,
            'formatter': 'standard',
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'standard'
        },
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
        'django': {
            'handlers': ['logfile', 'console'],
            'propagate': True,
            'level': 'INFO',
        },
        'api': {
            'handlers': ['logfile', 'console'],
            'propagate': True,
            'level': 'DEBUG',
        },
        'fserver': {
            'handlers': ['logfile', 'console'],
            'propagate': True,
            'level': 'DEBUG',
        },
        'panel': {
            'handlers': ['logfile', 'console'],
            'propagate': True,
            'level': 'DEBUG',
        },
        'reader': {
            'handlers': ['logfile', 'console'],
            'propagate': True,
            'level': 'DEBUG',
        },
        'report': {
            'handlers': ['logfile', 'console'],
            'propagate': True,
            'level': 'DEBUG',
        },
        'writer': {
            'handlers': ['logfile', 'console'],
            'propagate': True,
            'level': 'DEBUG',
        }

    }
}
