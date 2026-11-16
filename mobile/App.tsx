import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  SafeAreaView, 
  StatusBar,
  Modal,
  Image,
  Alert
} from 'react-native';
import { NoteItem, PurchaseRecord } from './src/types';

// Mock VTU Notes
const SAMPLE_NOTES: NoteItem[] = [
  {
    id: 'ntx-m-1',
    title: 'Computer Networks (21CS52) - VTU 5th Sem Complete Notes',
    description: 'Complete 5-Module VTU 2021 Scheme notes. Covers OSI, TCP/IP, Dijkstra routing with solved university question papers.',
    university: 'Visvesvaraya Technological University (VTU)',
    college: 'RV College of Engineering (RVCE)',
    course: 'B.E. CSE',
    branch: 'CSE',
    semester: 5,
    subject: 'Computer Networks',
    subjectCode: '21CS52',
    modules: ['Module 1: Application Layer', 'Module 2: Transport Layer', 'Module 3: Network Layer', 'Module 4: Link Layer', 'Module 5: Wireless'],
    price: 49,
    pagesCount: 84,
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    creatorName: 'Ananya Sharma',
    creatorCollege: 'RVCE Bengaluru',
    rating: 4.9,
    reviewsCount: 142,
    salesCount: 384,
    status: 'APPROVED',
  },
  {
    id: 'ntx-m-2',
    title: 'Database Management Systems (21CS53) - SQL & BCNF',
    description: 'High-yield DBMS notes for VTU 5th Sem. Contains ER diagrams, Relational Algebra and Normalization proofs.',
    university: 'Visvesvaraya Technological University (VTU)',
    college: 'BMS College of Engineering (BMSCE)',
    course: 'B.E. ISE',
    branch: 'ISE',
    semester: 5,
    subject: 'Database Management Systems',
    subjectCode: '21CS53',
    modules: ['Module 1: Intro & ER', 'Module 2: Relational Model', 'Module 3: SQL Triggers', 'Module 4: Normalization', 'Module 5: Concurrency'],
    price: 39,
    pagesCount: 68,
    coverImage: 'https://images.unsplash.com/photo-1507842229451-7f01be7fe70d?auto=format&fit=crop&q=80&w=600',
    creatorName: 'Karthik Rao',
    creatorCollege: 'BMSCE Bengaluru',
    rating: 4.8,
    reviewsCount: 98,
    salesCount: 247,
    status: 'APPROVED',
  },
  {
    id: 'ntx-m-3',
    title: 'Operating Systems (21CS44) - Core Concepts & Scheduling',
    description: 'CPU scheduling (Round Robin), Banker Algorithm, Paging and LRU Page replacement with handwritten diagrams.',
    university: 'Visvesvaraya Technological University (VTU)',
    college: 'MSRIT Bengaluru',
    course: 'B.E. CSE',
    branch: 'CSE',
    semester: 4,
    subject: 'Operating Systems',
    subjectCode: '21CS44',
    modules: ['Module 1: OS Structures', 'Module 2: Process Scheduling', 'Module 3: Deadlocks', 'Module 4: Virtual Memory', 'Module 5: Disk Scheduling'],
    price: 49,
    pagesCount: 76,
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600',
    creatorName: 'Priya Hegde',
    creatorCollege: 'MSRIT Bengaluru',
    rating: 4.9,
    reviewsCount: 184,
    salesCount: 420,
    status: 'APPROVED',
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'library' | 'creator' | 'profile'>('home');
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [purchasedIds, setPurchasedIds] = useState<string[]>(['ntx-m-1']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');

  // Creator state
  const [creatorNotes, setCreatorNotes] = useState<NoteItem[]>(SAMPLE_NOTES);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSubject, setUploadSubject] = useState('');
  const [uploadPrice, setUploadPrice] = useState('49');

  const studentName = 'Rahul Kumar';
  const studentEmail = 'rahul.k@student.vtu.ac.in';

  const handleSimulatePayment = (success: boolean) => {
    if (!selectedNote) return;
    if (success) {
      setPurchasedIds(prev => [...prev, selectedNote.id]);
      setCheckoutVisible(false);
      Alert.alert('Payment Successful!', `Reference: NTX-${Math.floor(10000 + Math.random() * 90000)}. Added to your Library!`);
    } else {
      Alert.alert('Simulated Failure', 'Test payment failed. No charges were processed.');
    }
  };

  const handleCreateNote = () => {
    if (!uploadTitle.trim() || !uploadSubject.trim()) {
      Alert.alert('Error', 'Please enter note title and subject.');
      return;
    }
    const newNote: NoteItem = {
      id: `ntx-m-${Date.now()}`,
      title: uploadTitle,
      description: 'Handwritten course summaries with diagrams and solved VTU questions.',
      university: 'VTU',
      college: 'RV College of Engineering',
      course: 'B.E.',
      branch: 'CSE',
      semester: 5,
      subject: uploadSubject,
      subjectCode: '21CS51',
      modules: ['Module 1-5 Complete Courseware'],
      price: Number(uploadPrice) || 49,
      pagesCount: 65,
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
      creatorName: studentName,
      creatorCollege: 'RVCE',
      rating: 5.0,
      reviewsCount: 0,
      salesCount: 0,
      status: 'PENDING_REVIEW',
    };
    setCreatorNotes([newNote, ...creatorNotes]);
    setUploadTitle('');
    setUploadSubject('');
    Alert.alert('Note Uploaded!', 'Submitted for moderation. Status: PENDING_REVIEW.');
  };

  const filteredNotes = creatorNotes.filter(n => {
    if (selectedBranch !== 'ALL' && n.branch !== selectedBranch) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.subject.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B132B" />

      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>NX</Text>
          </View>
          <Text style={styles.brandTitle}>Note<Text style={styles.brandAccent}>X</Text></Text>
        </View>
        <Text style={styles.headerSubtitle}>VTU Academic Marketplace</Text>
      </View>

      {/* Main Content Area */}
      <View style={styles.content}>
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Banner */}
            <View style={styles.heroBanner}>
              <Text style={styles.heroPretitle}>Your Notes. Your Knowledge.</Text>
              <Text style={styles.heroTitle}>Your Earnings.</Text>
              <Text style={styles.heroDesc}>
                Discover top-ranking VTU notes. Earn ₹ on every peer purchase with a flat ₹10 platform fee.
              </Text>
            </View>

            {/* Branch Chips */}
            <Text style={styles.sectionTitle}>Browse by Branch</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
              {['ALL', 'CSE', 'ISE', 'ECE', 'EEE', 'Mechanical'].map(b => (
                <TouchableOpacity 
                  key={b} 
                  style={[styles.chip, selectedBranch === b && styles.chipActive]}
                  onPress={() => setSelectedBranch(b)}
                >
                  <Text style={[styles.chipText, selectedBranch === b && styles.chipTextActive]}>{b}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Trending Notes */}
            <Text style={styles.sectionTitle}>Trending Engineering Notes</Text>
            {filteredNotes.map(note => (
              <TouchableOpacity 
                key={note.id} 
                style={styles.card}
                onPress={() => setSelectedNote(note)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.branchBadge}>{note.branch} • Sem {note.semester}</Text>
                  <Text style={styles.priceTag}>₹{note.price}</Text>
                </View>
                <Text style={styles.cardTitle}>{note.title}</Text>
                <Text style={styles.cardSubject}>{note.subject} ({note.subjectCode})</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.creatorName}>By {note.creatorName} ({note.creatorCollege})</Text>
                  <Text style={styles.ratingText}>★ {note.rating.toFixed(1)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* TAB 2: EXPLORE */}
        {activeTab === 'explore' && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search subject, code (e.g. 21CS52)..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <Text style={styles.resultsCount}>Showing {filteredNotes.length} notes</Text>
            {filteredNotes.map(note => (
              <TouchableOpacity 
                key={note.id} 
                style={styles.card}
                onPress={() => setSelectedNote(note)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.branchBadge}>{note.branch} • Sem {note.semester}</Text>
                  <Text style={styles.priceTag}>₹{note.price}</Text>
                </View>
                <Text style={styles.cardTitle}>{note.title}</Text>
                <Text style={styles.cardFooterText}>{note.pagesCount} Pages • {note.creatorCollege}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* TAB 3: LIBRARY */}
        {activeTab === 'library' && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.screenHeading}>My Purchased Library</Text>
            {purchasedIds.length === 0 ? (
              <Text style={styles.emptyText}>No purchased notes yet. Purchase any note via test checkout to read.</Text>
            ) : (
              SAMPLE_NOTES.filter(n => purchasedIds.includes(n.id)).map(note => (
                <View key={note.id} style={styles.card}>
                  <Text style={styles.licensedBadge}>✓ Licensed to {studentName}</Text>
                  <Text style={styles.cardTitle}>{note.title}</Text>
                  <Text style={styles.cardSubject}>{note.subject}</Text>
                  <TouchableOpacity 
                    style={styles.readButton}
                    onPress={() => {
                      setSelectedNote(note);
                      setViewerVisible(true);
                    }}
                  >
                    <Text style={styles.readButtonText}>Read Watermarked PDF</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        )}

        {/* TAB 4: CREATOR */}
        {activeTab === 'creator' && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.screenHeading}>Creator Studio</Text>
            <View style={styles.earningsCard}>
              <Text style={styles.earningsLabel}>Available Balance (UPI Ready)</Text>
              <Text style={styles.earningsAmount}>₹1,240.00</Text>
              <Text style={styles.earningsSub}>Flat ₹10 platform fee • 100% Student retained</Text>
            </View>

            <Text style={styles.sectionTitle}>Upload New Semester Note</Text>
            <View style={styles.uploadCard}>
              <Text style={styles.inputLabel}>Note Title</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Operating Systems Solved Notes"
                placeholderTextColor="#94A3B8"
                value={uploadTitle}
                onChangeText={setUploadTitle}
              />

              <Text style={styles.inputLabel}>Subject</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Computer Networks"
                placeholderTextColor="#94A3B8"
                value={uploadSubject}
                onChangeText={setUploadSubject}
              />

              <Text style={styles.inputLabel}>Selling Price (₹)</Text>
              <TextInput
                style={styles.input}
                placeholder="49"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={uploadPrice}
                onChangeText={setUploadPrice}
              />

              <TouchableOpacity style={styles.submitButton} onPress={handleCreateNote}>
                <Text style={styles.submitButtonText}>Submit Note (Private Storage)</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* TAB 5: PROFILE */}
        {activeTab === 'profile' && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.screenHeading}>Student Profile</Text>
            <View style={styles.card}>
              <Text style={styles.profileName}>{studentName}</Text>
              <Text style={styles.profileEmail}>{studentEmail}</Text>
              <Text style={styles.profileCollege}>RV College of Engineering (RVCE)</Text>
              <Text style={styles.profileDetails}>VTU 2021 Scheme • CSE Sem 5</Text>
            </View>
          </ScrollView>
        )}
      </View>

      {/* Note Detail Modal */}
      {selectedNote && !viewerVisible && (
        <Modal visible={Boolean(selectedNote)} animationType="slide">
          <SafeAreaView style={styles.modalContainer}>
            <ScrollView style={styles.modalContent}>
              <TouchableOpacity onPress={() => setSelectedNote(null)} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕ Close</Text>
              </TouchableOpacity>
              <Text style={styles.modalBranch}>{selectedNote.branch} • Sem {selectedNote.semester}</Text>
              <Text style={styles.modalTitle}>{selectedNote.title}</Text>
              <Text style={styles.modalDesc}>{selectedNote.description}</Text>
              <Text style={styles.sectionTitle}>Modules Covered</Text>
              {selectedNote.modules.map((m, i) => (
                <Text key={i} style={styles.moduleItem}>• {m}</Text>
              ))}

              <View style={styles.modalPriceRow}>
                <Text style={styles.modalPrice}>₹{selectedNote.price}</Text>
                {purchasedIds.includes(selectedNote.id) ? (
                  <TouchableOpacity 
                    style={styles.readButton} 
                    onPress={() => setViewerVisible(true)}
                  >
                    <Text style={styles.readButtonText}>Read in Viewer</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    style={styles.buyButton} 
                    onPress={() => setCheckoutVisible(true)}
                  >
                    <Text style={styles.buyButtonText}>Get for ₹{selectedNote.price}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}

      {/* Mock Checkout Modal */}
      {checkoutVisible && selectedNote && (
        <Modal visible={checkoutVisible} transparent animationType="fade">
          <View style={styles.overlay}>
            <View style={styles.checkoutBox}>
              <Text style={styles.checkoutTag}>TEST TRANSACTION • ZERO COST</Text>
              <Text style={styles.checkoutTitle}>Simulated Checkout</Text>
              <Text style={styles.checkoutSub}>{selectedNote.title}</Text>
              <View style={styles.breakdown}>
                <View style={styles.bRow}>
                  <Text style={styles.bText}>Selling Price:</Text>
                  <Text style={styles.bVal}>₹{selectedNote.price}.00</Text>
                </View>
                <View style={styles.bRow}>
                  <Text style={styles.bText}>NoteX Fee:</Text>
                  <Text style={styles.bVal}>- ₹10.00</Text>
                </View>
                <View style={styles.bRow}>
                  <Text style={styles.bTextCreator}>Creator Retains:</Text>
                  <Text style={styles.bValCreator}>₹{selectedNote.price - 10}.00</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.successBtn} 
                onPress={() => handleSimulatePayment(true)}
              >
                <Text style={styles.successBtnText}>Simulate Successful Payment</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.failBtn} 
                onPress={() => handleSimulatePayment(false)}
              >
                <Text style={styles.failBtnText}>Simulate Failed Payment</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setCheckoutVisible(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Protected Canvas Reader with Dynamic Diagonal Watermark */}
      {viewerVisible && selectedNote && (
        <Modal visible={viewerVisible} animationType="fade">
          <SafeAreaView style={styles.viewerContainer}>
            <View style={styles.viewerHeader}>
              <Text style={styles.viewerTitle}>{selectedNote.subject}</Text>
              <TouchableOpacity onPress={() => setViewerVisible(false)} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕ Close</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.watermarkCanvas}>
              {/* Watermark Diagonal Overlay */}
              <View style={styles.watermarkOverlay}>
                <Text style={styles.watermarkText}>LICENSED TO: {studentName.toUpperCase()}</Text>
                <Text style={styles.watermarkText}>NOTEX ID: NTX-91823 • STRICTLY CONFIDENTIAL</Text>
                <Text style={styles.watermarkText}>LICENSED TO: {studentName.toUpperCase()}</Text>
                <Text style={styles.watermarkText}>NOTEX ID: NTX-91823 • STRICTLY CONFIDENTIAL</Text>
              </View>
              <ScrollView style={styles.documentPage}>
                <Text style={styles.docHeading}>Module 1: Academic Principles & Solved Numericals</Text>
                <Text style={styles.docBody}>
                  As per Visvesvaraya Technological University (VTU) syllabus. This document is forensically watermarked with your user identity to discourage unauthorized screen redistribution.
                </Text>
                <Text style={styles.docFormula}>H(s) = Y(s) / X(s) = Σ [ P_k * Δ_k ] / Δ</Text>
                <Text style={styles.docBody}>
                  Verified exam questions and step-by-step proofs for university exams.
                </Text>
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modal>
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('home')}>
          <Text style={[styles.navText, activeTab === 'home' && styles.navTextActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('explore')}>
          <Text style={[styles.navText, activeTab === 'explore' && styles.navTextActive]}>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('library')}>
          <Text style={[styles.navText, activeTab === 'library' && styles.navTextActive]}>Library</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('creator')}>
          <Text style={[styles.navText, activeTab === 'creator' && styles.navTextActive]}>Creator</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('profile')}>
          <Text style={[styles.navText, activeTab === 'profile' && styles.navTextActive]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B132B' },
  header: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#0B132B', borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoBadge: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center' },
  logoText: { color: '#FFF', fontWeight: '900', fontSize: 14 },
  brandTitle: { fontSize: 20, fontWeight: '900', color: '#FFF' },
  brandAccent: { color: '#2563EB' },
  headerSubtitle: { color: '#94A3B8', fontSize: 11, marginTop: 2 },
  content: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  heroBanner: { backgroundColor: '#0B132B', padding: 18, borderRadius: 18, marginBottom: 16 },
  heroPretitle: { color: '#38BDF8', fontSize: 12, fontWeight: '700' },
  heroTitle: { color: '#FFF', fontSize: 24, fontWeight: '900', marginVertical: 4 },
  heroDesc: { color: '#CBD5E1', fontSize: 12, lineHeight: 18 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#0B132B', marginVertical: 10 },
  chipsRow: { marginBottom: 14 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFF', marginRight: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  chipActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  chipText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  chipTextActive: { color: '#FFF' },
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  branchBadge: { fontSize: 11, fontWeight: '700', color: '#2563EB', backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  priceTag: { fontSize: 16, fontWeight: '900', color: '#0B132B' },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#0F172A', lineHeight: 20 },
  cardSubject: { fontSize: 12, color: '#64748B', marginTop: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  creatorName: { fontSize: 11, color: '#475569', fontWeight: '600' },
  ratingText: { fontSize: 12, color: '#F59E0B', fontWeight: '800' },
  cardFooterText: { fontSize: 11, color: '#94A3B8', marginTop: 6 },
  searchContainer: { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 12, marginBottom: 10 },
  searchInput: { height: 42, fontSize: 13, color: '#0B132B' },
  resultsCount: { fontSize: 12, color: '#64748B', marginBottom: 10 },
  screenHeading: { fontSize: 20, fontWeight: '900', color: '#0B132B', marginBottom: 14 },
  licensedBadge: { color: '#059669', fontSize: 11, fontWeight: '800', marginBottom: 4 },
  readButton: { backgroundColor: '#059669', paddingVertical: 10, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  readButtonText: { color: '#FFF', fontWeight: '800', fontSize: 12 },
  buyButton: { backgroundColor: '#2563EB', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  buyButtonText: { color: '#FFF', fontWeight: '800', fontSize: 13 },
  earningsCard: { backgroundColor: '#0B132B', padding: 18, borderRadius: 16, marginBottom: 16 },
  earningsLabel: { color: '#94A3B8', fontSize: 12, fontWeight: '700' },
  earningsAmount: { color: '#34D399', fontSize: 28, fontWeight: '900', marginVertical: 4 },
  earningsSub: { color: '#CBD5E1', fontSize: 11 },
  uploadCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#475569', marginTop: 8, marginBottom: 4 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, padding: 10, fontSize: 13 },
  submitButton: { backgroundColor: '#7C3AED', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  submitButtonText: { color: '#FFF', fontWeight: '800', fontSize: 13 },
  profileName: { fontSize: 18, fontWeight: '800', color: '#0B132B' },
  profileEmail: { fontSize: 13, color: '#64748B', marginTop: 2 },
  profileCollege: { fontSize: 12, color: '#2563EB', marginTop: 6, fontWeight: '700' },
  profileDetails: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  emptyText: { fontSize: 13, color: '#64748B', marginTop: 20, textAlign: 'center' },
  modalContainer: { flex: 1, backgroundColor: '#FFF' },
  modalContent: { padding: 20 },
  closeBtn: { alignSelf: 'flex-end', padding: 8 },
  closeBtnText: { color: '#64748B', fontWeight: '700', fontSize: 14 },
  modalBranch: { color: '#2563EB', fontSize: 12, fontWeight: '800' },
  modalTitle: { fontSize: 20, fontWeight: '900', color: '#0B132B', marginVertical: 8 },
  modalDesc: { fontSize: 13, color: '#475569', lineHeight: 20 },
  moduleItem: { fontSize: 12, color: '#334155', marginVertical: 3 },
  modalPriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  modalPrice: { fontSize: 26, fontWeight: '900', color: '#0B132B' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  checkoutBox: { backgroundColor: '#FFF', borderRadius: 20, padding: 20 },
  checkoutTag: { fontSize: 10, fontWeight: '800', color: '#B45309', backgroundColor: '#FEF3C7', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  checkoutTitle: { fontSize: 18, fontWeight: '900', color: '#0B132B', marginTop: 8 },
  checkoutSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  breakdown: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, marginVertical: 14 },
  bRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 3 },
  bText: { fontSize: 12, color: '#64748B' },
  bVal: { fontSize: 12, fontWeight: '700', color: '#0B132B' },
  bTextCreator: { fontSize: 12, fontWeight: '800', color: '#059669' },
  bValCreator: { fontSize: 12, fontWeight: '800', color: '#059669' },
  successBtn: { backgroundColor: '#2563EB', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginBottom: 8 },
  successBtnText: { color: '#FFF', fontWeight: '800', fontSize: 13 },
  failBtn: { borderWidth: 1, borderColor: '#FCA5A5', paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  failBtnText: { color: '#DC2626', fontWeight: '700', fontSize: 12 },
  cancelBtn: { paddingVertical: 10, alignItems: 'center', marginTop: 6 },
  cancelText: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },
  viewerContainer: { flex: 1, backgroundColor: '#0F172A' },
  viewerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#1E293B' },
  viewerTitle: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  watermarkCanvas: { flex: 1, backgroundColor: '#FFF', position: 'relative' },
  watermarkOverlay: { position: 'absolute', top: 80, left: -40, right: 0, opacity: 0.12, transform: [{ rotate: '-30deg' }], zIndex: 10, pointerEvents: 'none' },
  watermarkText: { fontSize: 14, fontWeight: '900', color: '#DC2626', marginVertical: 16 },
  documentPage: { padding: 24, zIndex: 1 },
  docHeading: { fontSize: 18, fontWeight: '900', color: '#0F172A', marginBottom: 12 },
  docBody: { fontSize: 13, color: '#334155', lineHeight: 22, marginVertical: 8 },
  docFormula: { fontSize: 14, fontFamily: 'monospace', color: '#1D4ED8', backgroundColor: '#EFF6FF', padding: 12, borderRadius: 8, marginVertical: 12 },
  bottomNav: { flexDirection: 'row', backgroundColor: '#0B132B', borderTopWidth: 1, borderTopColor: '#1E293B', paddingVertical: 10 },
  navItem: { flex: 1, alignItems: 'center' },
  navText: { color: '#64748B', fontSize: 11, fontWeight: '700' },
  navTextActive: { color: '#38BDF8' }
});
