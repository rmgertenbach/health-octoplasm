const { useState, useMemo, useEffect } = React;

// ========== HELPER FUNCTIONS ==========
const getStatusIcon = (status) => {
  switch(status) {
    case 'available':
      return React.createElement('i', { className: 'fas fa-check-circle', style: { color: '#10B981' } });
    case 'partial':
      return React.createElement('i', { className: 'fas fa-exclamation-triangle', style: { color: '#F59E0B' } });
    case 'gap':
      return React.createElement('i', { className: 'fas fa-times-circle', style: { color: '#EF4444' } });
    default:
      return null;
  }
};

const getPriorityIcon = (priority) => {
  if (priority.includes('Highest') || priority.includes('HIGHEST')) {
    return React.createElement('i', { className: 'fas fa-circle', style: { color: '#EF4444', marginRight: '8px' } });
  } else if (priority.includes('Medium') || priority.includes('MEDIUM')) {
    return React.createElement('i', { className: 'fas fa-circle', style: { color: '#F59E0B', marginRight: '8px' } });
  } else {
    return React.createElement('i', { className: 'fas fa-circle', style: { color: '#10B981', marginRight: '8px' } });
  }
};

// ========== FILTER CONTROLS COMPONENT ==========
const FilterControls = ({ filters, onFilterChange, resultCount }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFilterChange({ ...filters, search: value });
  };

  const handlePersonaChange = (persona) => {
    const newPersonas = filters.personas.includes(persona)
      ? filters.personas.filter(p => p !== persona)
      : [...filters.personas, persona];
    onFilterChange({ ...filters, personas: newPersonas });
  };

  const handleTierChange = (tier) => {
    onFilterChange({ ...filters, tier: tier === filters.tier ? null : tier });
  };

  const handleDataFilterChange = (filterType) => {
    onFilterChange({ ...filters, dataFilter: filterType === filters.dataFilter ? 'all' : filterType });
  };

  const handleSortChange = (e) => {
    onFilterChange({ ...filters, sortBy: e.target.value });
  };

  return React.createElement('div', null,
    // Search bar
    React.createElement('div', { style: { marginBottom: '20px' } },
      React.createElement('div', { style: { position: 'relative', maxWidth: '600px' } },
        React.createElement('i', {
          className: 'fas fa-search',
          style: {
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#94a3b8'
          }
        }),
        React.createElement('input', {
          type: 'text',
          placeholder: 'Search use cases by title, problem, or description...',
          value: searchTerm,
          onChange: handleSearchChange,
          style: {
            width: '100%',
            padding: '12px 16px 12px 48px',
            fontSize: '1rem',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            outline: 'none',
            transition: 'all 0.2s',
          },
          onFocus: (e) => e.target.style.borderColor = '#0066CC',
          onBlur: (e) => e.target.style.borderColor = '#e2e8f0'
        })
      )
    ),

    // Filter controls grid
    React.createElement('div', {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }
    },
      // Persona filter
      React.createElement('div', null,
        React.createElement('label', {
          style: {
            display: 'block',
            fontWeight: '600',
            marginBottom: '8px',
            fontSize: '0.9rem',
            color: '#475569'
          }
        }, 'Persona'),
        React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '8px' } },
          UseCaseData.personas.slice(0, 3).map(persona =>
            React.createElement('button', {
              key: persona.id,
              onClick: () => handlePersonaChange(persona.id),
              style: {
                padding: '8px 16px',
                borderRadius: '6px',
                border: filters.personas.includes(persona.id) ? '2px solid #0066CC' : '2px solid #e2e8f0',
                background: filters.personas.includes(persona.id) ? '#EBF5FF' : 'white',
                color: filters.personas.includes(persona.id) ? '#0066CC' : '#64748b',
                fontWeight: filters.personas.includes(persona.id) ? '600' : '400',
                cursor: 'pointer',
                fontSize: '0.85rem',
                transition: 'all 0.2s'
              }
            },
              React.createElement('i', { className: `fas ${persona.icon}`, style: { marginRight: '6px' } }),
              persona.name.replace('/Employees', '')
            )
          )
        )
      ),

      // Tier filter
      React.createElement('div', null,
        React.createElement('label', {
          style: {
            display: 'block',
            fontWeight: '600',
            marginBottom: '8px',
            fontSize: '0.9rem',
            color: '#475569'
          }
        }, 'Tier'),
        React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '8px' } },
          UseCaseData.tiers.map(tier =>
            React.createElement('button', {
              key: tier.id,
              onClick: () => handleTierChange(tier.id),
              style: {
                padding: '8px 16px',
                borderRadius: '6px',
                border: filters.tier === tier.id ? `2px solid ${tier.color}` : '2px solid #e2e8f0',
                background: filters.tier === tier.id ? `${tier.color}15` : 'white',
                color: filters.tier === tier.id ? tier.color : '#64748b',
                fontWeight: filters.tier === tier.id ? '600' : '400',
                cursor: 'pointer',
                fontSize: '0.85rem',
                transition: 'all 0.2s'
              }
            }, `Tier ${tier.id}`)
          )
        )
      ),

      // Data availability filter
      React.createElement('div', null,
        React.createElement('label', {
          style: {
            display: 'block',
            fontWeight: '600',
            marginBottom: '8px',
            fontSize: '0.9rem',
            color: '#475569'
          }
        }, 'Data Availability'),
        React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '8px' } },
          ['buildable', 'partial', 'all'].map(filterType =>
            React.createElement('button', {
              key: filterType,
              onClick: () => handleDataFilterChange(filterType),
              style: {
                padding: '8px 16px',
                borderRadius: '6px',
                border: filters.dataFilter === filterType ? '2px solid #0066CC' : '2px solid #e2e8f0',
                background: filters.dataFilter === filterType ? '#EBF5FF' : 'white',
                color: filters.dataFilter === filterType ? '#0066CC' : '#64748b',
                fontWeight: filters.dataFilter === filterType ? '600' : '400',
                cursor: 'pointer',
                fontSize: '0.85rem',
                transition: 'all 0.2s'
              }
            },
              filterType === 'buildable' ? React.createElement('span', null,
                React.createElement('i', { className: 'fas fa-check-circle', style: { marginRight: '6px', color: '#10B981' } }),
                'Buildable'
              ) :
              filterType === 'partial' ? React.createElement('span', null,
                React.createElement('i', { className: 'fas fa-exclamation-triangle', style: { marginRight: '6px', color: '#F59E0B' } }),
                'Partial'
              ) :
              'All'
            )
          )
        )
      ),

      // Sort by
      React.createElement('div', null,
        React.createElement('label', {
          style: {
            display: 'block',
            fontWeight: '600',
            marginBottom: '8px',
            fontSize: '0.9rem',
            color: '#475569'
          }
        }, 'Sort By'),
        React.createElement('select', {
          value: filters.sortBy,
          onChange: handleSortChange,
          style: {
            width: '100%',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '2px solid #e2e8f0',
            background: 'white',
            fontSize: '0.85rem',
            cursor: 'pointer'
          }
        },
          React.createElement('option', { value: 'tier' }, 'Tier (1→3)'),
          React.createElement('option', { value: 'availability' }, 'Data Availability'),
          React.createElement('option', { value: 'persona' }, 'Persona'),
          React.createElement('option', { value: 'id' }, 'Use Case ID')
        )
      )
    ),

    // Results count
    React.createElement('div', {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        borderTop: '1px solid #e2e8f0'
      }
    },
      React.createElement('div', { style: { fontSize: '0.9rem', color: '#64748b' } },
        `Showing ${resultCount} use case${resultCount !== 1 ? 's' : ''}`
      ),
      filters.personas.length > 0 || filters.tier || filters.dataFilter !== 'all' || filters.search ?
        React.createElement('button', {
          onClick: () => {
            setSearchTerm('');
            onFilterChange({
              personas: [],
              tier: null,
              dataFilter: 'all',
              search: '',
              sortBy: 'tier'
            });
          },
          style: {
            padding: '6px 12px',
            borderRadius: '6px',
            border: 'none',
            background: '#f1f5f9',
            color: '#475569',
            fontSize: '0.85rem',
            cursor: 'pointer',
            fontWeight: '500'
          }
        },
          React.createElement('i', { className: 'fas fa-times', style: { marginRight: '6px' } }),
          'Clear Filters'
        ) : null
    )
  );
};

// ========== USE CASE CARD COMPONENT ==========
const UseCaseCard = ({ useCase, onClick }) => {
  const tierInfo = UseCaseData.tiers.find(t => t.id === useCase.tier);
  const personaInfo = UseCaseData.personas.find(p => p.id === useCase.persona);

  // Calculate data availability breakdown
  const totalDataRequirements =
    useCase.dataRequirements.primary.length +
    useCase.dataRequirements.secondary.length;

  const availableCount = [...useCase.dataRequirements.primary, ...useCase.dataRequirements.secondary]
    .filter(d => d.status === 'available').length;

  const partialCount = [...useCase.dataRequirements.primary, ...useCase.dataRequirements.secondary]
    .filter(d => d.status === 'partial').length;

  return React.createElement('div', {
    className: 'use-case-card',
    style: {
      background: 'white',
      borderRadius: '12px',
      border: '2px solid #e2e8f0',
      padding: '24px',
      transition: 'all 0.3s',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
    },
    onClick: onClick
  },
    // Header
    React.createElement('div', { style: { marginBottom: '16px' } },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' } },
        // Tier badge
        React.createElement('div', {
          style: {
            padding: '4px 12px',
            borderRadius: '6px',
            background: `${tierInfo.color}15`,
            color: tierInfo.color,
            fontSize: '0.75rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }
        }, tierInfo.label),
        // Persona icon
        React.createElement('i', {
          className: `fas ${personaInfo.icon}`,
          style: { fontSize: '1.2rem', color: '#94a3b8' }
        })
      ),

      // Title
      React.createElement('h3', {
        style: {
          fontSize: '1.3rem',
          fontWeight: '700',
          color: '#1e293b',
          marginBottom: '8px',
          lineHeight: '1.3'
        }
      }, useCase.id + ': ' + useCase.title),

      // Persona label
      React.createElement('div', {
        style: {
          fontSize: '0.85rem',
          color: '#64748b',
          marginBottom: '12px'
        }
      }, personaInfo.name)
    ),

    // Problem statement
    React.createElement('p', {
      style: {
        color: '#475569',
        fontSize: '0.95rem',
        lineHeight: '1.6',
        marginBottom: '16px'
      }
    }, useCase.problem),

    // Impact
    React.createElement('div', {
      style: {
        background: '#f8fafc',
        padding: '12px',
        borderRadius: '6px',
        borderLeft: '3px solid #0066CC',
        marginBottom: '16px'
      }
    },
      React.createElement('div', {
        style: {
          fontSize: '0.75rem',
          fontWeight: '600',
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '4px'
        }
      }, 'Impact'),
      React.createElement('div', {
        style: {
          fontSize: '0.9rem',
          color: '#1e293b',
          fontWeight: '500'
        }
      }, useCase.impact)
    ),

    // Data availability bar
    React.createElement('div', { style: { marginBottom: '16px' } },
      React.createElement('div', {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '6px'
        }
      },
        React.createElement('span', {
          style: {
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }
        }, 'Data Availability'),
        React.createElement('span', {
          style: {
            fontSize: '0.85rem',
            fontWeight: '600',
            color: useCase.availabilityScore >= 70 ? '#10B981' :
                   useCase.availabilityScore >= 40 ? '#F59E0B' : '#EF4444'
          }
        }, useCase.availabilityScore + '%')
      ),
      React.createElement('div', {
        style: {
          height: '8px',
          background: '#e2e8f0',
          borderRadius: '4px',
          overflow: 'hidden',
          display: 'flex'
        }
      },
        React.createElement('div', {
          style: {
            width: `${(availableCount / totalDataRequirements) * 100}%`,
            background: '#10B981',
            transition: 'width 0.3s'
          }
        }),
        React.createElement('div', {
          style: {
            width: `${(partialCount / totalDataRequirements) * 100}%`,
            background: '#F59E0B',
            transition: 'width 0.3s'
          }
        })
      ),
      React.createElement('div', {
        style: {
          display: 'flex',
          gap: '12px',
          marginTop: '6px',
          fontSize: '0.75rem',
          color: '#64748b'
        }
      },
        React.createElement('span', null,
          React.createElement('i', { className: 'fas fa-check-circle', style: { marginRight: '4px', color: '#10B981' } }),
          availableCount
        ),
        React.createElement('span', null,
          React.createElement('i', { className: 'fas fa-exclamation-triangle', style: { marginRight: '4px', color: '#F59E0B' } }),
          partialCount
        ),
        React.createElement('span', null,
          React.createElement('i', { className: 'fas fa-times-circle', style: { marginRight: '4px', color: '#EF4444' } }),
          totalDataRequirements - availableCount - partialCount
        )
      )
    ),

    // View Details button
    React.createElement('div', {
      style: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '12px',
        borderTop: '1px solid #e2e8f0',
        color: '#0066CC',
        fontSize: '0.85rem',
        fontWeight: '600'
      }
    },
      React.createElement('i', {
        className: 'fas fa-arrow-right',
        style: { marginRight: '8px' }
      }),
      'View Details'
    )
  );
};

// ========== USE CASE MODAL COMPONENT ==========
const UseCaseModal = ({ useCase, onClose }) => {
  const tierInfo = UseCaseData.tiers.find(t => t.id === useCase.tier);
  const personaInfo = UseCaseData.personas.find(p => p.id === useCase.persona);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return React.createElement('div', {
    className: 'use-case-modal-overlay',
    onClick: onClose
  },
    React.createElement('div', {
      className: 'use-case-modal-content',
      onClick: (e) => e.stopPropagation()
    },
      // Modal Header
      React.createElement('div', { className: 'use-case-modal-header' },
        React.createElement('button', {
          className: 'use-case-modal-close',
          onClick: onClose,
          'aria-label': 'Close modal'
        }, '×'),

        React.createElement('h2', { className: 'use-case-modal-title' },
          useCase.id + ': ' + useCase.title
        ),

        React.createElement('div', { className: 'use-case-modal-meta' },
          React.createElement('div', {
            style: {
              padding: '4px 12px',
              borderRadius: '6px',
              background: `${tierInfo.color}15`,
              color: tierInfo.color,
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }
          }, tierInfo.label),
          React.createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#64748b'
            }
          },
            React.createElement('i', { className: `fas ${personaInfo.icon}` }),
            React.createElement('span', null, personaInfo.name)
          ),
          React.createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '6px',
              background: useCase.availabilityScore >= 70 ? '#10B98115' :
                         useCase.availabilityScore >= 40 ? '#F59E0B15' : '#EF444415',
              color: useCase.availabilityScore >= 70 ? '#10B981' :
                     useCase.availabilityScore >= 40 ? '#F59E0B' : '#EF4444',
              fontSize: '0.85rem',
              fontWeight: '600'
            }
          },
            React.createElement('i', { className: 'fas fa-database' }),
            React.createElement('span', null, useCase.availabilityScore + '% Data Available')
          )
        )
      ),

      // Modal Body
      React.createElement('div', { className: 'use-case-modal-body' },
        // Problem
        React.createElement('div', { className: 'use-case-modal-section' },
          React.createElement('h3', { className: 'use-case-modal-section-title' },
            React.createElement('i', { className: 'fas fa-exclamation-circle' }),
            'The Problem'
          ),
          React.createElement('p', { className: 'use-case-modal-section-content' }, useCase.problem)
        ),

        // Impact
        React.createElement('div', { className: 'use-case-modal-section' },
          React.createElement('h3', { className: 'use-case-modal-section-title' },
            React.createElement('i', { className: 'fas fa-chart-line' }),
            'Impact'
          ),
          React.createElement('p', { className: 'use-case-modal-section-content' }, useCase.impact)
        ),

        // Description
        React.createElement('div', { className: 'use-case-modal-section' },
          React.createElement('h3', { className: 'use-case-modal-section-title' },
            React.createElement('i', { className: 'fas fa-info-circle' }),
            'Solution Description'
          ),
          React.createElement('p', { className: 'use-case-modal-section-content' }, useCase.description)
        ),

        // Key Features
        React.createElement('div', { className: 'use-case-modal-section' },
          React.createElement('h3', { className: 'use-case-modal-section-title' },
            React.createElement('i', { className: 'fas fa-list-check' }),
            'Key Features'
          ),
          React.createElement('ul', { className: 'use-case-modal-list' },
            useCase.keyFeatures.map((feature, idx) =>
              React.createElement('li', {
                key: idx,
                className: 'use-case-modal-list-item'
              }, feature)
            )
          )
        ),

        // Data Requirements
        React.createElement('div', { className: 'use-case-modal-section' },
          React.createElement('h3', { className: 'use-case-modal-section-title' },
            React.createElement('i', { className: 'fas fa-database' }),
            'Data Requirements'
          ),

          ['primary', 'secondary', 'ideal'].map(category =>
            useCase.dataRequirements[category].length > 0 &&
            React.createElement('div', { key: category, style: { marginBottom: '20px' } },
              React.createElement('h4', {
                style: {
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                  letterSpacing: '0.5px'
                }
              }, category + ' Data'),
              React.createElement('div', { className: 'use-case-modal-data-req' },
                useCase.dataRequirements[category].map((req, idx) =>
                  React.createElement('div', {
                    key: idx,
                    className: 'use-case-modal-data-item'
                  },
                    React.createElement('div', { className: 'use-case-modal-data-item-name' },
                      React.createElement('span', { style: { fontSize: '1.1rem', marginRight: '8px' } }, getStatusIcon(req.status)),
                      React.createElement('span', null, req.name)
                    ),
                    req.note && React.createElement('div', {
                      className: 'use-case-modal-data-item-note'
                    }, req.note)
                  )
                )
              )
            )
          )
        ),

        // Strategic Value
        React.createElement('div', { className: 'use-case-modal-section' },
          React.createElement('h3', { className: 'use-case-modal-section-title' },
            React.createElement('i', { className: 'fas fa-star' }),
            'Strategic Value'
          ),
          React.createElement('ul', { className: 'use-case-modal-list' },
            useCase.strategicValue.map((value, idx) =>
              React.createElement('li', {
                key: idx,
                className: 'use-case-modal-list-item'
              }, value)
            )
          )
        ),

        // Why This Tier (for Tier 2/3)
        useCase.whyThisTier && React.createElement('div', { className: 'use-case-modal-section' },
          React.createElement('div', {
            style: {
              background: `${tierInfo.color}10`,
              padding: '20px',
              borderRadius: '8px',
              borderLeft: `4px solid ${tierInfo.color}`
            }
          },
            React.createElement('h3', {
              style: {
                fontSize: '1rem',
                fontWeight: '600',
                color: tierInfo.color,
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }
            }, `Why Tier ${useCase.tier}?`),
            React.createElement('p', {
              style: {
                color: '#475569',
                lineHeight: '1.7',
                margin: 0
              }
            }, useCase.whyThisTier)
          )
        )
      )
    )
  );
};

// ========== MAIN APP COMPONENT ==========
const MainApp = () => {
  const [filters, setFilters] = useState({
    personas: [],
    tier: null,
    dataFilter: 'all',
    search: '',
    sortBy: 'tier'
  });

  const [modalUseCase, setModalUseCase] = useState(null);

  // Filter and sort use cases
  const filteredUseCases = useMemo(() => {
    let filtered = UseCaseData.useCases.filter(uc => {
      // Persona filter
      if (filters.personas.length > 0 && !filters.personas.includes(uc.persona)) {
        return false;
      }

      // Tier filter
      if (filters.tier !== null && uc.tier !== filters.tier) {
        return false;
      }

      // Data availability filter
      if (filters.dataFilter === 'buildable' && uc.availabilityScore < 70) {
        return false;
      }
      if (filters.dataFilter === 'partial' && (uc.availabilityScore < 40 || uc.availabilityScore >= 70)) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const searchableText = `${uc.id} ${uc.title} ${uc.problem} ${uc.description}`.toLowerCase();
        if (!searchableText.includes(searchLower)) {
          return false;
        }
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'tier':
          return a.tier - b.tier || a.id.localeCompare(b.id);
        case 'availability':
          return b.availabilityScore - a.availabilityScore;
        case 'persona':
          return a.persona.localeCompare(b.persona) || a.id.localeCompare(b.id);
        case 'id':
          return a.id.localeCompare(b.id);
        default:
          return 0;
      }
    });

    return filtered;
  }, [filters]);

  return React.createElement('div', null,
    // Render filter controls in portal
    ReactDOM.createPortal(
      React.createElement(FilterControls, {
        filters: filters,
        onFilterChange: setFilters,
        resultCount: filteredUseCases.length
      }),
      document.getElementById('filters-root')
    ),

    // Use case cards
    filteredUseCases.length > 0 ?
      React.createElement('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px'
        }
      },
        filteredUseCases.map(uc =>
          React.createElement(UseCaseCard, {
            key: uc.id,
            useCase: uc,
            onClick: () => setModalUseCase(uc)
          })
        )
      ) :
      // No results message
      React.createElement('div', {
        style: {
          textAlign: 'center',
          padding: '80px 20px',
          color: '#64748b'
        }
      },
        React.createElement('i', {
          className: 'fas fa-search',
          style: { fontSize: '4rem', marginBottom: '20px', opacity: 0.3 }
        }),
        React.createElement('h3', {
          style: { fontSize: '1.5rem', fontWeight: '600', marginBottom: '12px' }
        }, 'No use cases found'),
        React.createElement('p', {
          style: { fontSize: '1rem' }
        }, 'Try adjusting your filters or search terms')
      ),

    // Modal (rendered in portal)
    modalUseCase && ReactDOM.createPortal(
      React.createElement(UseCaseModal, {
        useCase: modalUseCase,
        onClose: () => setModalUseCase(null)
      }),
      document.getElementById('use-case-modal-root')
    )
  );
};

// ========== DATA GAPS COMPONENT ==========
const DataGapsDisplay = () => {
  return React.createElement('div', {
    style: {
      display: 'grid',
      gap: '20px'
    }
  },
    DataLakeInventory.recommendations.map((rec, idx) =>
      React.createElement('div', {
        key: idx,
        style: {
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          border: '2px solid #e2e8f0',
          borderLeft: `4px solid ${
            rec.priority.includes('Highest') || rec.priority.includes('HIGHEST') ? '#EF4444' : '#F59E0B'
          }`
        }
      },
        React.createElement('div', {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '12px'
          }
        },
          React.createElement('div', {
            style: {
              fontSize: '0.8rem',
              fontWeight: '700',
              color: rec.priority.includes('Highest') || rec.priority.includes('HIGHEST') ? '#EF4444' : '#F59E0B',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center'
            }
          },
            getPriorityIcon(rec.priority),
            rec.priority.replace(/🔴|🟡|🟢/g, '').trim()
          ),
          React.createElement('div', {
            style: {
              padding: '4px 12px',
              borderRadius: '6px',
              background: '#f1f5f9',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#64748b'
            }
          }, rec.timeline)
        ),
        React.createElement('h3', {
          style: {
            fontSize: '1.2rem',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '12px'
          }
        }, rec.action),
        React.createElement('p', {
          style: {
            color: '#475569',
            lineHeight: '1.6',
            marginBottom: '12px'
          }
        }, rec.rationale),
        React.createElement('div', {
          style: {
            background: '#f8fafc',
            padding: '12px',
            borderRadius: '6px',
            fontSize: '0.9rem',
            color: '#1e293b',
            fontWeight: '500'
          }
        },
          React.createElement('i', {
            className: 'fas fa-chart-line',
            style: { marginRight: '8px', color: '#10B981' }
          }),
          rec.estimatedROI
        )
      )
    )
  );
};

// ========== RENDER APPLICATIONS ==========
const useCasesRoot = ReactDOM.createRoot(document.getElementById('use-cases-root'));
useCasesRoot.render(React.createElement(MainApp));

const dataGapsRoot = ReactDOM.createRoot(document.getElementById('data-gaps-root'));
dataGapsRoot.render(React.createElement(DataGapsDisplay));
