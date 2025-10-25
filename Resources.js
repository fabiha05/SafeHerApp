//recources.js
import { useState } from 'react';
import { Alert, Linking, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ResourcesScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Main resource categories
  const resourceCategories = [
    {
      id: 1,
      title: 'Emergency',
      icon: 'alert-circle',
      description: 'Immediate help contacts',
      color: '#FCF8F9'
    },
    {
      id: 2,
      title: 'Shelters',
      icon: 'home-heart',
      description: 'Find safe places nearby',
      color: '#FCF8F9'
    },
    {
      id: 3,
      title: 'Legal Aid',
      icon: 'scale-balance',
      description: 'Get legal advice and support',
      color: '#FCF8F9'
    },
    {
      id: 4,
      title: 'Helplines',
      icon: 'phone',
      description: 'Talk to someone now',
      color: '#FCF8F9'
    },
    {
      id: 5,
      title: 'Therapy',
      icon: 'medical-bag',
      description: 'Find a therapist',
      color: '#FCF8F9'
    },
    {
      id: 6,
      title: 'Know Your Rights',
      icon: 'file-document',
      description: 'Learn about your rights',
      color: '#FCF8F9'
    }
  ];
// Karachi-specific resources
  const resources = {
    'Emergency': [
      {
        id: 1,
        title: 'Police Emergency',
        description: 'Immediate police assistance',
        icon: 'police-badge',
        details: {
          phone: '15',
          hours: '24/7',
          description: 'Emergency police helpline for immediate assistance in dangerous situations.'
        }
      },
      {
        id: 2,
        title: 'Women Protection Helpline',
        description: 'Government support for women',
        icon: 'shield-account',
        details: {
          phone: '1094',
          hours: '24/7',
          description: 'Government helpline dedicated to protecting women from violence and abuse.'
        }
      },
      {
        id: 3,
        title: 'Emergency Ambulance',
        description: 'Medical emergency response',
        icon: 'ambulance',
        details: {
          phone: '1122',
          hours: '24/7',
          description: 'Emergency medical services and ambulance for urgent health situations.'
        }
      }
    ],
    'Helplines': [
      {
        id: 4,
        title: 'Inspector General of Police',
        description: 'Offering emergency services',
        icon: 'badge-account-horizontal',
        details: {
          phone: '9110',
          hours: '24/7',
          description: 'Offering emergency assistance, advice and policing services for all cases.'
        }
      },
      {
        id: 5,
        title: 'Aurat Foundation',
        description: 'Women rights organization',
        icon: 'account-group',
        details: {
          phone: '+92-21-35851341',
          hours: 'Mon-Fri: 9am-5pm',
          description: 'Provides free legal counsel, court representation, and assistance for women survivors of violence.'
        }
      },
      {
        id: 6,
        title: 'Sindh Legal Advisory',
        description: 'Legal assistance helpline',
        icon: 'phone-classic',
        details: {
          phone: '+92080070806',
          hours: '24/7',
          description: 'Free legal services and support for vulnerable women.'
        }
      }
    ],
    'Shelters': [
      {
        id: 7,
        title: 'Dar-ul-Aman Shelter',
        description: 'Government shelter for women',
        icon: 'home-heart',
        details: {
          address: 'Darulaman Shelter Home Khanewal 8W3Q+6CH, Khanewal, Pakistan',
          phone: '03213006000',
          hours: '24/7',
          description: 'Government-run shelter providing safe accommodation, food, and basic necessities for women in distress.'
        }
      },
      {
        id: 8,
        title: 'Panah Shelter Home',
        description: 'Private women shelter',
        icon: 'home-group',
        details: {
          address: 'Panah Shelter Home North Nazimabad, Karachi',
          phone: '02136360025',
          hours: '24/7',
          description: 'Private shelter offering protection, counseling, and rehabilitation services for abused women.'
        }
      },
      {
        id: 9,
        title: 'Edhi Shelter',
        description: 'Emergency shelter services',
        icon: 'home-city',
        details: {
          address: 'EDHI OLD HOME Plot A 15, beside Edhi Old Home, Sector 5-I Sector 5 M New Karachi Town, Karachi, Pakistan',
          phone: '02136349411',
          hours: '24/7',
          description: 'Emergency shelter providing immediate protection and support for women in crisis situations.'
        }
      },
      {
        id: 10,
        title: 'Sindh Commission on the Status of Women (SCSW)',
        description: 'Womens shelter',
        icon: 'home-account',
        details: {
          address: '65, Saddar Karachi, Pakistan',
          phone: '02199211110',
          hours: '24/7',
          description: 'Dedicated to protecting womens rights and providing shelter for those in need.'
        }
      }
    ],
    'Legal Aid': [
      {
        id: 11,
        title: 'Sindh Legal Aid Committee',
        description: 'Government legal support',
        icon: 'scale-balance',
        details: {
          address: 'Sindh Secretariat, Karachi',
          phone: '02199211267',
          hours: 'Mon-Fri: 9am-4pm',
          description: 'Government body providing legal assistance and support to women in need.'
        }
      },
      {
        id: 12,
        title: 'Legal Rights Forum',
        description: 'Free legal consultation',
        icon: 'gavel',
        details: {
          address: 'Block 7, Gulshan-e-Iqbal, Karachi',
          phone: '02134981234',
          hours: 'Mon-Fri: 9am-5pm',
          description: 'Non-profit organization offering free legal consultation and representation for women.'
        }
      },
      {
        id: 13,
        title: 'Aurat Foundation',
        description: 'Free legal counsel',
        icon: 'account-group',
        details: {
          address: 'Zaki Centre, I-8 Markaz I 8 Markaz I-8, Islamabad, Pakistan',
          phone: '03512609596',
          hours: 'Mon-Fri: 9am-5pm',
          description: 'Provides free legal counsel, court representation, and assistance with filing FIRs for women survivors of violence.'
        }
      },
      {
        id: 14,
        title: 'Lawyers for Human Rights',
        description: 'Legal aid organization',
        icon: 'account-details',
        details: {
          address: 'Office No. 5, 2nd Floor, Block 7, Gulshan-e-Iqbal, Karachi',
          phone: '+92-321-2057582',
          hours: 'Mon-Fri: 9am-5pm',
          description: 'Provides free legal aid to vulnerable groups, with a strong focus on women\'s rights.'
        }
      }
    ],
    'Therapy': [
      {
        id: 15,
        title: 'Aga Khan University Hospital',
        description: 'Mental health services',
        icon: 'hospital-building',
        details: {
          address: 'The Aga Khan University Hospital (AKUH) National Stadium Rd, Aga Khan University Hospital, Karachi, 74800, Pakistan',
          phone: '021111911911',
          hours: '24/7',
          description: 'Comprehensive mental health services including counseling and therapy for trauma survivors.'
        }
      },
      {
        id: 16,
        title: 'Jinnah Postgraduate Medical Centre',
        description: 'Psychiatric department',
        icon: 'medical-bag',
        details: {
          address: 'Jinnah Postgraduate Medical Center (JPMC) Rafiqui, Sarwar Shaheed Rd, Karachi Cantonment, Karachi, 75510, Pakistan',
          phone: '02199201300',
          hours: 'Mon-Sat: 8am-4pm',
          description: 'Government hospital offering psychiatric services and trauma counseling.'
        }
      },
      {
        id: 17,
        title: 'Trauma Release Centre',
        description: 'Mental health service',
        icon: 'brain',
        details: {
          address: '3rd Floor, Lane 4, 43 - C Khayaban-e-Shahbaz, D.H.A Phase 6 Karachi, 75600, Pakistan',
          phone: '03171188507',
          hours: 'Mon-Fri: 9am-7pm',
          description: 'Specialized clinic for trauma, PTSD, anxiety, and depression, with expertise in helping women survivors of abuse.'
        }
      },
      {
        id: 18,
        title: 'Karachi Psychiatric Hospital',
        description: 'Specialized mental health care',
        icon: 'hospital',
        details: {
          address: 'Karachi Psychiatric Hospital (Head Office) b, 1 Nazimabad Rd Number 3, Nazimabad 3 Block 3 Nazimabad, Karachi, 74600, Pakistan',
          phone: '021111760760',
          hours: 'Mon-Sat: 9am-5pm',
          description: 'Specialized psychiatric hospital with experienced therapists for domestic violence survivors.'
        }
      }
    ],
    'Know Your Rights': [
      {
        id: 19,
        title: 'Domestic Violence Act',
        description: 'Legal protections overview',
        icon: 'file-document',
        details: {
          description: 'Information about your legal rights and protections against domestic violence under Pakistani law.',
          link: 'https://sja.gos.pk/assets/Acts_Ordinances_Rules/Domestic%20Violence%20%28Prevention%20and%20Protection%29%20Act%2C%202013%20%26%20Rules%2C%202016%20%28Amendments%20upto%20date%29.pdf'
        }
      },
      {
        id: 20,
        title: 'Women Rights Handbook',
        description: 'Comprehensive guide',
        icon: 'book-open',
        details: {
          description: 'A detailed guide to women rights in Pakistan including legal protections and how to access them.',
          link: 'https://shirkatgah.org/shirkat/wp-content/uploads/2017/02/UPR-book-Women-Rights-in-Pakistan-English.pdf'
        }
      }
    ]
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const goBackToCategories = () => {
    setSelectedCategory(null);
  };

  const openResourceDetails = (resource) => {
    setSelectedResource(resource);
    setModalVisible(true);
  };

  const closeResourceDetails = () => {
    setModalVisible(false);
    setSelectedResource(null);
  };

  const openPdf = (url) => {
    Linking.openURL(url)
      .catch(err => Alert.alert('Error', 'Could not open the document'));
  };

  const getDirections = (address) => {
    Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(address + ', Karachi, Pakistan')}`)
      .catch(err => Alert.alert('Error', 'Could not open maps'));
  };

  const makeCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`)
      .catch(err => Alert.alert('Error', 'Could not make the call'));
  };

  // Render category selection screen
  if (!selectedCategory) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Resources</Text>
          <Text style={styles.headerSubtitle}>Karachi, Pakistan</Text>
        </View>

        {/* Content */}
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>Available Resources</Text>
          <View style={styles.categoriesContainer}>
            {resourceCategories.map((category) => (
              <TouchableOpacity 
                key={category.id}
                style={[styles.categoryCard, { backgroundColor: category.color }]}
                onPress={() => handleCategorySelect(category.title)}
              >
                {/* ONLY THIS LINE CHANGED - color from #FFF to #000000 */}
                <Icon name={category.icon} size={32} color="#000000" style={styles.categoryIcon} />
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  // Render resources for selected category
  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBackToCategories}>
          <Icon name="arrow-left" size={24} color="#1b0e12" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{selectedCategory}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {resources[selectedCategory] ? (
          resources[selectedCategory].map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.resourceItem}
              onPress={() => openResourceDetails(item)}
            >
              <View style={styles.iconContainer}>
                <Icon name={item.icon} size={24} color="#1b0e12" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
              </View>
              <Icon name="chevron-right" size={24} color="#974e67" />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noResources}>
            <Icon name="information-outline" size={48} color="#974e67" />
            <Text style={styles.noResourcesText}>No resources available for this category yet.</Text>
          </View>
        )}
      </ScrollView>

      {/* Resource Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeResourceDetails}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedResource && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalIconContainer}>
                    <Icon name={selectedResource.icon} size={28} color="#1b0e12" />
                  </View>
                  <Text style={styles.modalTitle}>{selectedResource.title}</Text>
                  <TouchableOpacity onPress={closeResourceDetails} style={styles.closeButton}>
                    <Icon name="close" size={24} color="#1b0e12" />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.detailsContainer}>
                  <Text style={styles.descriptionText}>{selectedResource.details.description}</Text>
                  
                  {selectedResource.details.address && (
                    <View style={styles.detailSection}>
                      <Text style={styles.sectionHeader}>Address</Text>
                      <Text style={styles.detailText}>{selectedResource.details.address}</Text>
                    </View>
                  )}
                  
                  {selectedResource.details.phone && (
                    <View style={styles.detailSection}>
                      <Text style={styles.sectionHeader}>Contact</Text>
                      <Text style={styles.detailText}>{selectedResource.details.phone}</Text>
                    </View>
                  )}
                  
                  {selectedResource.details.hours && (
                    <View style={styles.detailSection}>
                      <Text style={styles.sectionHeader}>Hours</Text>
                      <Text style={styles.detailText}>{selectedResource.details.hours}</Text>
                    </View>
                  )}
                  
                  {selectedResource.details.link && (
                    <View style={styles.detailSection}>
                      <Text style={styles.sectionHeader}>Document</Text>
                      <Text style={styles.detailText}>
                        Tap the button below to view the document.
                      </Text>
                    </View>
                  )}
                </ScrollView>
                
                <View style={styles.actionButtons}>
                  {selectedResource.details.address && (
                    <TouchableOpacity 
                      style={styles.directionsButton}
                      onPress={() => getDirections(selectedResource.details.address)}
                    >
                      <Icon name="map-marker" size={20} color="#1b0e12" />
                      <Text style={styles.directionsButtonText}>Get Directions</Text>
                    </TouchableOpacity>
                  )}
                  
                  {selectedResource.details.phone && (
                    <TouchableOpacity 
                      style={styles.callButton}
                      onPress={() => makeCall(selectedResource.details.phone)}
                    >
                      <Icon name="phone" size={20} color="#FFFFFF" />
                      <Text style={styles.callButtonText}>Call Now</Text>
                    </TouchableOpacity>
                  )}
                  
                  {selectedResource.details.link && (
                    <TouchableOpacity 
                      style={styles.pdfButton}
                      onPress={() => openPdf(selectedResource.details.link)}
                    >
                      <Icon name="file-pdf-box" size={20} color="#FFFFFF" />
                      <Text style={styles.pdfButtonText}>View Document</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ALL STYLES REMAIN EXACTLY THE SAME
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7E8EB' 
  },
  header: {
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
    backgroundColor: '#F7E8EB',
    borderBottomWidth: 1,
    borderBottomColor: '#F3E7EB'
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 16,
    zIndex: 1,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerTitle: {
    color: '#1b0e12',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  headerSubtitle: {
    color: '#974e67',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  headerSpacer: {
    width: 48
  },
  content: {
    flex: 1,
    paddingBottom: 20
  },
  sectionTitle: {
    color: '#1b0e12',
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 20,
    marginBottom: 16
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  categoryCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryIcon: {
    marginBottom: 8
  },
  categoryTitle: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4
  },
  categoryDescription: {
    color: '#974e67',
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.9
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#FCF8F9',
    paddingHorizontal: 16,
    minHeight: 80,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3E7EB'
  },
  iconContainer: {
    backgroundColor: '#F3E7EB',
    borderRadius: 12,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0
  },
  textContainer: {
    justifyContent: 'center',
    flex: 1
  },
  itemTitle: {
    color: '#1b0e12',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4
  },
  itemDescription: {
    color: '#974e67',
    fontSize: 14,
    fontWeight: 'normal'
  },
  noResources: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40
  },
  noResourcesText: {
    color: '#974e67',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FCF8F9',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3E7EB',
  },
  modalIconContainer: {
    backgroundColor: '#F3E7EB',
    borderRadius: 12,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalTitle: {
    color: '#1b0e12',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  detailsContainer: {
    padding: 20,
  },
  descriptionText: {
    color: '#1b0e12',
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 22,
  },
  detailSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    color: '#974e67',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  detailText: {
    color: '#1b0e12',
    fontSize: 15,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3E7EB',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E7EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    minWidth: '35%'
  },
  directionsButtonText: {
    color: '#1b0e12',
    fontWeight: '600',
    marginLeft: 8,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E12764',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    minWidth: '35%'
  },
  callButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  pdfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E12764',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    minWidth: '80%'
  },
  pdfButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },                      
});

export default ResourcesScreen;